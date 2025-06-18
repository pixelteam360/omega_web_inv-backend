"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutPlansValidation = void 0;
const zod_1 = require("zod");
const WorkoutPlansValidationSchema = zod_1.z.object({
    workoutId: zod_1.z.string(),
});
exports.WorkoutPlansValidation = {
    WorkoutPlansValidationSchema,
};
