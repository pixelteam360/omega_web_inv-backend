"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationValidation = exports.MessageTypeEnum = void 0;
const zod_1 = require("zod");
exports.MessageTypeEnum = zod_1.z.enum(["PAID", "UNPAID", "ALL"]);
const NotificationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    body: zod_1.z.string(),
    type: exports.MessageTypeEnum.optional(),
});
exports.NotificationValidation = {
    NotificationSchema,
};
