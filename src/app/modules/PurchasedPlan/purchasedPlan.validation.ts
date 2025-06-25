import { z } from "zod";

const CreatePurchasedPlanValidationSchema = z.object({
  subscriptionId: z.string(),
  paymentId: z.string(),
});

export const PurchasedPlanValidation = {
  CreatePurchasedPlanValidationSchema,
};
