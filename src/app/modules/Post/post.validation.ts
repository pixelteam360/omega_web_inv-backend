import { z } from "zod";

const PostValidationSchema = z.object({
  description: z.string(),
});

export const ReportPostSchema = z.object({
  message: z.string(),
  postId: z.string(),
});

export const PostValidation = {
  PostValidationSchema,
  ReportPostSchema,
};
