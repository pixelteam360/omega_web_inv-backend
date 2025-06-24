import { z } from "zod";

const CreateAdminValidationSchema = z.object({
  fullName: z.string(),
  email: z.string().email("Invalid email address").min(1, "Email is required"), // Ensure email is provided and is valid
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const AdminLoginValidationSchema = z.object({
  email: z.string().email("Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const AdminUpdateSchema = z.object({
  fullName: z.string().optional(),
});

export const AdminValidation = {
  CreateAdminValidationSchema,
  AdminLoginValidationSchema,
  AdminUpdateSchema,
};
