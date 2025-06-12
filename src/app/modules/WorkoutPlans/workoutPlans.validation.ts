import { z } from "zod";

const WorkoutPlansValidationSchema = z.object({
  workoutId: z.string(),
});


export const WorkoutPlansValidation = {
  WorkoutPlansValidationSchema,
};
