import { z } from "zod";

export const userTypeEnum = z.enum(["PAID", "UNPAID", "ALL"]);
export const isoDateSchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid ISO date format",
  });

const DiscountCodeSchema = z.object({
  code: z.number().int(),
  discount: z.number(),
  userType: userTypeEnum,
  expireDate: isoDateSchema,
});

export const AdminValidation = {
  DiscountCodeSchema,
};
