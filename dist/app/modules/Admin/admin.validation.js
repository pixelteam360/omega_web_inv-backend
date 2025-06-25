"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidation = exports.isoDateSchema = exports.userTypeEnum = void 0;
const zod_1 = require("zod");
exports.userTypeEnum = zod_1.z.enum(["PAID", "UNPAID", "ALL"]);
exports.isoDateSchema = zod_1.z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid ISO date format",
});
const DiscountCodeSchema = zod_1.z.object({
    code: zod_1.z.number().int(),
    discount: zod_1.z.number(),
    userType: exports.userTypeEnum,
    expireDate: exports.isoDateSchema,
});
exports.AdminValidation = {
    DiscountCodeSchema,
};
