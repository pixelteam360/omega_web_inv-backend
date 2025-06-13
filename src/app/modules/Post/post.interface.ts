import { UserRole } from "@prisma/client";

export type TPost = {
  id: string;
  description: string;
  images: string[];
  video?: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type IPostFilterRequest = {
  description?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
};
