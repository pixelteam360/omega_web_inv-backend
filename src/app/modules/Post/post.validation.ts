import { z } from "zod";

const PostValidationSchema = z.object({
  description: z.string(),
});

export const PostValidation = {
  PostValidationSchema
};
