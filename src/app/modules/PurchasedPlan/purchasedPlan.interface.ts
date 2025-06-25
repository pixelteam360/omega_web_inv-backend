export type TPurchasedPlan = {
  id: string;
  paymentId: string;
  amount: number;
  activePlan: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  planId: string;
};
