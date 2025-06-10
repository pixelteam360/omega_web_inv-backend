import { z } from "zod";
export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

export const FitnessGoalEnum = z.enum([
  "LOSE_WEIGHT",
  "BUILD_MUSCLE",
  "STAY_HEALTHY",
  "OTHER",
]);

const UserInfoValidationSchema = z.object({
  fullName: z.string(),
  image: z.string().optional(),
  age: z.number().int(),
  gender: GenderEnum,
  weight: z.number(),
  height: z.number(),
  fitnessGoal: z.string(),
  dietaryPreference: z.string(),
});

const UserInfoUpdateSchema = z.object({
  fullName: z.string().optional(),
  image: z.string().optional(),
  age: z.number().int().optional(),
  gender: GenderEnum.optional(),
  weight: z.number().optional(),
  height: z.number().optional(),
  fitnessGoal: z.string().optional(),
  dietaryPreference: z.string().optional(),
});

export const UserInfoValidation = {
  UserInfoValidationSchema,
  UserInfoUpdateSchema,
};
