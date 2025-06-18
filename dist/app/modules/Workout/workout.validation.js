"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutValidation = void 0;
const zod_1 = require("zod");
const WorkoutValidationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    duration: zod_1.z.string(),
    Kcal: zod_1.z.number().int(),
    fitnessGoal: zod_1.z.string(),
});
const WorkoutUpdateSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    duration: zod_1.z.string().optional(),
    Kcal: zod_1.z.number().int().optional(),
    fitnessGoal: zod_1.z.string().optional(),
});
exports.WorkoutValidation = {
    WorkoutValidationSchema,
    WorkoutUpdateSchema,
};
