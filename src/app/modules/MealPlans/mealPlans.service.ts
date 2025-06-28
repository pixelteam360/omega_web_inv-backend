import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TMealPlans } from "./mealPlans.interface";

const creatMealPlansIntoDb = async (payload: TMealPlans, userId: string) => {
  const nutrition = await prisma.nutrition.findFirst({
    where: { id: payload.nutritionId },
  });

  if (!nutrition) {
    throw new ApiError(httpStatus.NOT_FOUND, "Nutrition not found");
  }

  const workoutPlan = await prisma.mealPlans.findFirst({
    where: { userId, nutritionId: nutrition.id, isCompleted: false },
  });

  if (workoutPlan) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already added this meal plan. You need to complete this first"
    );
  }

  const result = await prisma.mealPlans.create({
    data: { ...payload, userId },
  });

  return result;
};

const myMealPlans = async (userId: string) => {
  const result = await prisma.mealPlans.findMany({
    where: { userId },
    select: {
      id: true,
      isCompleted: true,
      nutrition: {
        select: {
          id: true,
          title: true,
          mealTime: true,
          fitnessGoal: true,
          icon: true,
          nutritionTips: true,
          nutritionItems: true,
        },
      },
    },
  });

  return result;
};

const getSinglMealPlans = async (id: string) => {
  const result = await prisma.mealPlans.findFirst({
    where: { id },
    select: {
      id: true,
      isCompleted: true,
      nutrition: {
        select: {
          id: true,
          title: true,
          mealTime: true,
          fitnessGoal: true,
          icon: true,
          nutritionTips: true,
          nutritionItems: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  }
  return result;
};

const makeCompletedMealPlans = async (userId: string, MealPlansId: string) => {
  const MealPlans = await prisma.mealPlans.findFirst({
    where: { id: MealPlansId, userId },
  });

  if (!MealPlans) {
    throw new ApiError(httpStatus.NOT_FOUND, "Workout not found");
  }

  const result = await prisma.mealPlans.update({
    where: { id: MealPlans.id },
    data: { isCompleted: true },
  });

  return result;
};

export const deletMealPlans = async () => {
  await prisma.mealPlans.deleteMany();

  console.log("success deleted");
  return { message: "All MealPlans deleted successfully" };
};

export const MealPlansService = {
  creatMealPlansIntoDb,
  myMealPlans,
  getSinglMealPlans,
  makeCompletedMealPlans,
};
