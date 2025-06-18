"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FitnessGoalValidation = void 0;
const zod_1 = require("zod");
const FitnessGoalValidationSchema = zod_1.z.object({
    title: zod_1.z.string(),
});
exports.FitnessGoalValidation = {
    FitnessGoalValidationSchema,
};
