import { UserRole } from "@prisma/client";

export type TNutrition = {
  id?: string;
  icon: string;
  title: string;
  images: string[];
  duration: string;
  Kcal: number;
  fitnessGoal: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type INutritionFilterRequest = {
  title?: string | undefined;
  fitnessGoal?: string | undefined;
  searchTerm?: string | undefined;
};
