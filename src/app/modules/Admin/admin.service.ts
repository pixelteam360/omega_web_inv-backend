import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { sendNotification } from "../Notification/notification.service";
import { TDiscountCode } from "./admin.interface";

const dashboardOverView = async () => {
  const users = await prisma.user.count();
  const plans = await prisma.plan.count();
  const fitnessGoal = await prisma.fitnessGoal.count();
  const workout = await prisma.workout.count();
  const nutrition = await prisma.nutrition.count();
  const progress = await prisma.user.count();
  const trainerSupport = await prisma.room.count({
    where: { roomType: "TRAINER" },
  });
  const nutritionSupport = await prisma.room.count({
    where: { roomType: "NUTRITION" },
  });

  return {
    users,
    plans,
    fitnessGoal,
    workout,
    nutrition,
    progress,
    trainerSupport,
    nutritionSupport,
  };
};

const userProgress = async (id: string) => {
  const res = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      userInfo: true,
      bodyMeasurement: true,
      weightProgress: true,
      purchasedPlan: true,
    },
  });

  const workout = await prisma.workoutPlans.findMany({
    where: { userId: id },
    select: { id: true, isCompleted: true, workout: true },
  });

  const meal = await prisma.mealPlans.findMany({
    where: { userId: id },
    select: {
      id: true,
      isCompleted: true,
      nutrition: true,
    },
  });

  return { ...res, workout, meal };
};

const createDiscountCode = async (payload: TDiscountCode) => {
  const discount = await prisma.discountCode.findFirst({
    where: { code: payload.code },
  });

  if (discount) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This discount code already exists"
    );
  }

  const res = await prisma.discountCode.create({
    data: payload,
  });

  const notification = {
    title: "New Discount Code 🎁",
    body: `You have received a discount code that gives you ${payload.discount}% off on all plans. Your code: ${payload.code}`,
    type: payload.userType,
  };

  await sendNotification(notification);

  return res;
};

const getAllDiscountCode = async () => {
  const res = await prisma.discountCode.findMany();
  return res;
};

export const AdminService = {
  dashboardOverView,
  userProgress,
  createDiscountCode,
  getAllDiscountCode,
};
