import { z } from "zod";

const changePasswordValidationSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

const otpValidationSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  otp: z
    .number({ invalid_type_error: "OTP must be a 5-digit number." })
    .int()
    .gte(10000, { message: "OTP must be a 5-digit number." })
    .lte(99999, { message: "OTP must be a 5-digit number." }),
});

export const authValidation = {
  changePasswordValidationSchema,
  otpValidationSchema,
};
