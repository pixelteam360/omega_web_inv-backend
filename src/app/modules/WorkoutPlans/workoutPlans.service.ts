import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TWorkoutPlans } from "./workoutPlans.interface";

const creatWorkoutPlansIntoDb = async (
  payload: TWorkoutPlans,
  userId: string
) => {
  const workout = await prisma.workout.findFirst({
    where: { id: payload.workoutId },
  });

  if (!workout) {
    throw new ApiError(httpStatus.NOT_FOUND, "Workout not found");
  }

  const workoutPlan = await prisma.workoutPlans.findFirst({
    where: { userId, workoutId: workout.id, isCompleted: false },
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

  const workoutPlansCount = await prisma.workoutPlans.count({
    where: { userId },
  });

  if (workoutPlansCount >= 5 && user?.activePlan === false) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can only add up to 5 workout in free plan"
    );
  }

  const result = await prisma.workoutPlans.create({
    data: { ...payload, userId },
  });

  return result;
};

const myWorkoutPlans = async (userId: string) => {
  const result = await prisma.workoutPlans.findMany({
    where: { userId },
    select: {
      id: true,
      isCompleted: true,
      workout: true,
    },
  });

  return result;
};

const getSinglWorkoutPlans = async (id: string) => {
  const result = await prisma.workoutPlans.findFirst({
    where: { id },
    select: {
      id: true,
      isCompleted: true,
      workout: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  }
  return result;
};

const makeCompletedWorkoutPlans = async (
  userId: string,
  WorkoutPlansId: string
) => {
  const WorkoutPlans = await prisma.workoutPlans.findFirst({
    where: { id: WorkoutPlansId, userId },
    select: {
      id: true,
      isCompleted: true,
      workout: {
        select: {
          id: true,
          Kcal: true,
        },
      },
    },
  });

  if (!WorkoutPlans) {
    throw new ApiError(httpStatus.NOT_FOUND, "Workout Plans not found");
  }

  const dailyGoal = await prisma.dailyGoal.findFirst({
    where: { userId },
    select: { id: true, CaloriesBurned: true },
  });

  const totalBurned = dailyGoal?.CaloriesBurned! + WorkoutPlans.workout.Kcal;

  const result = await prisma.$transaction(async (prisma) => {
    const updatePlan = await prisma.workoutPlans.update({
      where: { id: WorkoutPlans.id },
      data: { isCompleted: true },
    });

    await prisma.dailyGoal.update({
      where: { id: dailyGoal?.id },
      data: { CaloriesBurned: totalBurned },
    });

    return updatePlan;
  });

  return result;
};

export const deletWorkoutPlans = async () => {
  await prisma.$transaction(async (prisma) => {
    await prisma.workoutPlans.deleteMany();

    await prisma.dailyGoal.updateMany({
      data: { CaloriesBurned: 0, CaloriesConsumed: 0 },
    });
  });

  return { message: "All Workout Plans deleted successfully" };
};

export const WorkoutPlansService = {
  creatWorkoutPlansIntoDb,
  myWorkoutPlans,
  getSinglWorkoutPlans,
  makeCompletedWorkoutPlans,
};
