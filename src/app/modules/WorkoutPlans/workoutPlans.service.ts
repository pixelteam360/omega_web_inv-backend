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
      "You have already added this workout"
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
  });

  if (!WorkoutPlans) {
    throw new ApiError(httpStatus.NOT_FOUND, "Workout not found");
  }

  const result = await prisma.workoutPlans.update({
    where: { id: WorkoutPlans.id },
    data: { isCompleted: true },
  });

  return result;
};

export const deletWorkoutPlans = async () => {
  await prisma.workoutPlans.deleteMany();

  console.log('success deleted');
  return { message: "All WorkoutPlans deleted successfully" };
};

export const WorkoutPlansService = {
  creatWorkoutPlansIntoDb,
  myWorkoutPlans,
  getSinglWorkoutPlans,
  makeCompletedWorkoutPlans,
};
