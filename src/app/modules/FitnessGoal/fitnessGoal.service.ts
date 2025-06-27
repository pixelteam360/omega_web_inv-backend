import prisma from "../../../shared/prisma";
import { FitnessGoal } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";
import { TFitnessGoal } from "./fitnessGoal.interface";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

const createFitnessGoalIntoDb = async (payload: TFitnessGoal) => {
  const result = await prisma.fitnessGoal.create({
    data: payload,
  });

  return result;
};

const getFitnessGoalsFromDb = async () => {
  const result = await prisma.fitnessGoal.findMany();
  return result;
};

const getSingleFitnessGoal = async (id: string) => {
  const FitnessGoalProfile = await prisma.fitnessGoal.findUnique({
    where: { id },
  });

  return FitnessGoalProfile;
};

const updateFitnessGoal = async (
  payload: Partial<FitnessGoal>,
  FitnessGoalId: string
) => {
  const result = await prisma.fitnessGoal.update({
    where: { id: FitnessGoalId },
    data: { title: payload.title },
  });

  return result;
};

const deleteFitnessGoal = async (FitnessGoalId: string) => {
  const existingGoal = await prisma.fitnessGoal.findUnique({
    where: { id: FitnessGoalId },
  });

  if (!existingGoal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fitness goal not found");
  }

  const result = await prisma.fitnessGoal.delete({
    where: { id: FitnessGoalId },
  });

  return {
    message: "Fitness goal deleted successfully",
  };
};

export const FitnessGoalService = {
  createFitnessGoalIntoDb,
  getFitnessGoalsFromDb,
  getSingleFitnessGoal,
  updateFitnessGoal,
  deleteFitnessGoal,
};
