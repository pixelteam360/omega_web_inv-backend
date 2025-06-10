import prisma from "../../../shared/prisma";
import { FitnessGoal } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";
import { TFitnessGoal } from "./fitnessGoal.interface";

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

export const FitnessGoalService = {
  createFitnessGoalIntoDb,
  getFitnessGoalsFromDb,
  getSingleFitnessGoal,
  updateFitnessGoal,
};
