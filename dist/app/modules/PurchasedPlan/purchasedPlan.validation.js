"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasedPlanValidation = void 0;
const zod_1 = require("zod");
const CreatePurchasedPlanValidationSchema = zod_1.z.object({
    subscriptionId: zod_1.z.string(),
    paymentId: zod_1.z.string(),
});
exports.PurchasedPlanValidation = {
    CreatePurchasedPlanValidationSchema,
};
