"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealPlansValidation = void 0;
const zod_1 = require("zod");
const MealPlansValidationSchema = zod_1.z.object({
    nutritionId: zod_1.z.string(),
});
exports.MealPlansValidation = {
    MealPlansValidationSchema,
};
