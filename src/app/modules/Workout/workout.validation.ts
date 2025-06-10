import { z } from "zod";

const WorkoutValidationSchema = z.object({
  title: z.string(),
  duration: z.string(),
  Kcal: z.number().int(),
  fitnessGoal: z.string(),
});

const WorkoutUpdateSchema = z.object({
  title: z.string().optional(),
  duration: z.string().optional(),
  Kcal: z.number().int().optional(),
  fitnessGoal: z.string().optional(),
});

export const WorkoutValidation = {
  WorkoutValidationSchema,
  WorkoutUpdateSchema,
};
