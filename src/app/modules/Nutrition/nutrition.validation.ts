import { MealTime } from "@prisma/client";
import { z } from "zod";

const NutritiontValidationSchema = z.object({
  title: z.string(),
  mealTime: z.nativeEnum(MealTime),
  fitnessGoal: z.string().optional(),
});

const NutritiontUpdateSchema = z.object({
  title: z.string().optional(),
  mealTime: z.nativeEnum(MealTime).optional(),
  fitnessGoal: z.string().optional(),
});

export const NutritiontValidation = {
  NutritiontValidationSchema,
  NutritiontUpdateSchema,
};
