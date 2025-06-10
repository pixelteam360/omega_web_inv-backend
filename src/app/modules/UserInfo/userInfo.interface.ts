import { Gender } from "@prisma/client";

export type TUserInfo = {
  id: string;
  fullName: string;
  image?: string;
  age: number;
  gender: Gender;
  weight: number;
  height: number;
  fitnessGoal: string;
  dietaryPreference: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
};
