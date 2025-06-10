import { UserRole } from "@prisma/client";

export type TUser = {
  id: string;
  email: string;
  phone: string;
  birth: Date;
  activePlan: boolean;
  refferralCode?: string;
  password: string;
  role: UserRole;
  isDeleted: boolean;
  expirationOtp?: Date;
  otp?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IUserFilterRequest = {
  phone?: string | undefined;
  email?: string | undefined;
  birth?: string | undefined;
  searchTerm?: string | undefined;
};
