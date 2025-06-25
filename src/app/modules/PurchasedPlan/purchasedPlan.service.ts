import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TPurchasedPlan } from "./purchasedPlan.interface";

const createPurchasedPlanIntoDb = async (
  payload: TPurchasedPlan,
  userId: string
) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  const Plan = await prisma.plan.findFirst({
    where: { id: payload.id },
  });

  if (!Plan) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Plan not found");
  }

  const havePlan = await prisma.purchasedPlan.findFirst({
    where: { userId },
  });

  if (havePlan?.activePlan) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You already have a active Plan"
    );
  }

  const startDate = new Date();

  const endDate = new Date(
    startDate.getTime() + Plan.duration * 24 * 60 * 60 * 1000
  );

  const amount = Plan.price;

  if (havePlan) {
    const result = await prisma.$transaction(async (prisma) => {
      const updatePlan = await prisma.purchasedPlan.update({
        where: { id: havePlan.id, userId },
        data: {
          activePlan: true,
          startDate: startDate,
          amount,
          planId: payload.planId,
          endDate,
        },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { activePlan: true },
      });

      return updatePlan;
    });

    return result;
  } else {
    const result = await prisma.$transaction(async (prisma) => {
      const createPlan = await prisma.purchasedPlan.create({
        data: {
          ...payload,
          userId: user.id,
          activePlan: true,
          endDate,
          amount,
          paymentId: "",
        },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { activePlan: true },
      });

      return createPlan;
    });

    return result;
  }
};

const getPurchasedPlansFromDb = async () => {
  const result = await prisma.purchasedPlan.findMany({});
  return result;
};

const getSinglePurchasedPlan = async (id: string) => {
  const result = await prisma.purchasedPlan.findUnique({
    where: { id },
  });
  return result;
};

const getMyPurchasedPlan = async (userId: string) => {
  const result = await prisma.purchasedPlan.findFirst({
    where: { userId, activePlan: true },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User have no subsceiption");
  }
  return result;
};

export const checkPlans = async () => {
  const today = new Date();
  const expiredPlans = await prisma.purchasedPlan.findMany({
    where: { endDate: { lt: today }, activePlan: true },
    select: { id: true, userId: true },
  });

  const expiredUserIds = expiredPlans.map((sub) => sub.userId);

  await prisma.$transaction(async (prisma) => {
    const updatePlan = await prisma.purchasedPlan.updateMany({
      where: { userId: { in: expiredUserIds } },
      data: { activePlan: false },
    });

    const updateUser = await prisma.user.updateMany({
      where: { id: { in: expiredUserIds }, activePlan: true },
      data: { activePlan: false },
    });
    return {
      updatePlan,
      updateUser,
    };
  });
};

export const PurchasedPlanService = {
  createPurchasedPlanIntoDb,
  getPurchasedPlansFromDb,
  getSinglePurchasedPlan,
  getMyPurchasedPlan,
};
