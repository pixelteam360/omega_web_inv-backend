import { MealTime } from "@prisma/client";

export type TNutrition = {
  id?: string;
  icon: string;
  title: string;
  Kcal: number;
  fitnessGoal: string;
  mealTime: MealTime;
  items: any[];
  nutritionTips: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type INutritionFilterRequest = {
  title?: string | undefined;
  fitnessGoal?: string | undefined;
  searchTerm?: string | undefined;
};
