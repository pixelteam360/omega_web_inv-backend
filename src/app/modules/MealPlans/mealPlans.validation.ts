import { z } from "zod";

const MealPlansValidationSchema = z.object({
  nutritionId: z.string(),
});


export const MealPlansValidation = {
  MealPlansValidationSchema,
};
