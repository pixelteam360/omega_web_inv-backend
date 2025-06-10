import { z } from "zod";

const FitnessGoalValidationSchema = z.object({
  title: z.string(),
});



export const FitnessGoalValidation = {
  FitnessGoalValidationSchema,
};
