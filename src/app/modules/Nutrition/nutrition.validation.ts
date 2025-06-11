import { z } from "zod";

const NutritiontValidationSchema = z.object({
  title: z.string(),
  duration: z.string(),
  Kcal: z.number().int(),
  fitnessGoal: z.string(),
});

const NutritiontUpdateSchema = z.object({
  title: z.string().optional(),
  duration: z.string().optional(),
  Kcal: z.number().int().optional(),
  fitnessGoal: z.string().optional(),
});

export const NutritiontValidation = {
  NutritiontValidationSchema,
  NutritiontUpdateSchema,
};
