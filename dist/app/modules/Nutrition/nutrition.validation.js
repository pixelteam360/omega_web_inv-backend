"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritiontValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const NutritiontValidationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    mealTime: zod_1.z.nativeEnum(client_1.MealTime),
    fitnessGoal: zod_1.z.string().optional(),
});
const NutritiontUpdateSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    mealTime: zod_1.z.nativeEnum(client_1.MealTime).optional(),
    fitnessGoal: zod_1.z.string().optional(),
});
exports.NutritiontValidation = {
    NutritiontValidationSchema,
    NutritiontUpdateSchema,
};
