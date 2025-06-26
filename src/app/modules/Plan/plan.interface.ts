import { PlanType } from "@prisma/client";

export type TPlan = {
  id?: string;
  title: string;
  duration: number;
  price: number;
  features: string[];
  type: PlanType;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
