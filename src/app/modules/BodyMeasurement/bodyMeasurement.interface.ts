import { UserRole } from "@prisma/client";

export type TBodyMeasurement = {
  id: string;
  unit: "CM" | "IN" | "KG" | "LB";
  startingChest: number;
  presentChest: number;
  startingWaist: number;
  presentWaist: number;
  startingHips: number;
  presentHips: number;
  startingArms: number;
  presentArms: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  weight: number;
};
