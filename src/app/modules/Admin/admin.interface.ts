import { MessageType } from "@prisma/client";

export type TDiscountCode = {
  id: string;
  code: number;
  discount: number;
  userType: MessageType;
  expireDate: Date;
  createdAt: Date;
  updatedAt: Date;
};
