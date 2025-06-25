export type TPlan = {
  id?: string;
  title: string;
  duration: number;
  price: number;
  features: string[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
