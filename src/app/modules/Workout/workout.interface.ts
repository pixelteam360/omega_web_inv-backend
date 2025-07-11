import { UserRole } from "@prisma/client";

export type TWorkout = {
  id?: string;
  icon: string;
  title: string;
  thumbnail: string;
  video: string
  duration: string;
  Kcal: number;
  fitnessGoal: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IWorkoutFilterRequest = {
  title?: string | undefined;
  fitnessGoal?: string | undefined;
  searchTerm?: string | undefined;
};
