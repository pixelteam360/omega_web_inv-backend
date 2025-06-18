"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfoValidation = exports.FitnessGoalEnum = exports.GenderEnum = void 0;
const zod_1 = require("zod");
exports.GenderEnum = zod_1.z.enum(["MALE", "FEMALE", "OTHER"]);
exports.FitnessGoalEnum = zod_1.z.enum([
    "LOSE_WEIGHT",
    "BUILD_MUSCLE",
    "STAY_HEALTHY",
    "OTHER",
]);
const UserInfoValidationSchema = zod_1.z.object({
    fullName: zod_1.z.string(),
    image: zod_1.z.string().optional(),
    age: zod_1.z.number().int(),
    gender: exports.GenderEnum,
    weight: zod_1.z.number(),
    height: zod_1.z.number(),
    fitnessGoal: zod_1.z.string(),
    dietaryPreference: zod_1.z.string(),
});
const UserInfoUpdateSchema = zod_1.z.object({
    fullName: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
    age: zod_1.z.number().int().optional(),
    gender: exports.GenderEnum.optional(),
    weight: zod_1.z.number().optional(),
    height: zod_1.z.number().optional(),
    fitnessGoal: zod_1.z.string().optional(),
    dietaryPreference: zod_1.z.string().optional(),
});
exports.UserInfoValidation = {
    UserInfoValidationSchema,
    UserInfoUpdateSchema,
};
