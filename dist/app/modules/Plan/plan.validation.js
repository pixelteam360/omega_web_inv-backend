"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanValidation = void 0;
const zod_1 = require("zod");
const CreatePlanValidationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    duration: zod_1.z.number().int(),
    price: zod_1.z.number(),
    features: zod_1.z.array(zod_1.z.string()),
});
const PlanUpdateSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    duration: zod_1.z.number().int().optional(),
    price: zod_1.z.number().optional(),
});
exports.PlanValidation = {
    CreatePlanValidationSchema,
    PlanUpdateSchema,
};
