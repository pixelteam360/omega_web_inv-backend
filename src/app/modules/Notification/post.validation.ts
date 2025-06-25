import { z } from "zod";

export const MessageTypeEnum = z.enum(["PAID", "UNPAID", "ALL"]);

const NotificationSchema = z.object({
  title: z.string(),
  body: z.string(),
  type: MessageTypeEnum,
});

export const NotificationValidation = {
  NotificationSchema,
};
