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

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, activePlan: true },
  });

  const mealPlansCount = await prisma.mealPlans.count({
    where: { userId },
  });

  if (mealPlansCount >= 5 && user?.activePlan === false) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can only add up to 5 meal in free plan"
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
    select: {
      id: true,
      isCompleted: true,
      nutrition: {
        select: {
          nutritionItems: { select: { id: true, kcal: true } },
        },
      },
    },
  });

  if (!MealPlans) {
    throw new ApiError(httpStatus.NOT_FOUND, "Meal Plan not found");
  }

  const dailyGoal = await prisma.dailyGoal.findFirst({
    where: { userId },
    select: { id: true, CaloriesConsumed: true },
  });

  const newCalories =
    dailyGoal?.CaloriesConsumed! +
    MealPlans.nutrition.nutritionItems.reduce(
      (acc, item) => acc + item.kcal,
      0
    );

  const result = await prisma.$transaction(async (prisma) => {
    const updatePlan = await prisma.mealPlans.update({
      where: { id: MealPlans.id },
      data: { isCompleted: true },
    });
    if (!updatePlan) {
      throw new ApiError(httpStatus.NOT_FOUND, "Meal Plan not found");
    }
    await prisma.dailyGoal.update({
      where: { id: dailyGoal?.id },
      data: { CaloriesConsumed: newCalories },
    });
    return updatePlan;
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
