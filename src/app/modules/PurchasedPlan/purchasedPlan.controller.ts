import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PurchasedPlanService } from "./purchasedPlan.service";

const createPurchasedPlan = catchAsync(async (req, res) => {
  const result =
    await PurchasedPlanService.createPurchasedPlanIntoDb(
      req.body,
      req.user.id
    );
  sendResponse(res, {
    message: "Purchased Subscription successfully!",
    data: result,
  });
});

const getPurchasedPlans = catchAsync(async (req, res) => {
  const result =
    await PurchasedPlanService.getPurchasedPlansFromDb();
  sendResponse(res, {
    message: "Purchased Subscriptions retrieve successfully!",
    data: result,
  });
});

const getSinglePurchasedPlan = catchAsync(async (req, res) => {
  const result =
    await PurchasedPlanService.getSinglePurchasedPlan(
      req.params.id
    );
  sendResponse(res, {
    message: "Purchased Subscription retrieved successfully",
    data: result,
  });
});

const getMyPurchasedPlan = catchAsync(async (req, res) => {
  const { id } = req?.user;
  const result = await PurchasedPlanService.getMyPurchasedPlan(
    id
  );
  sendResponse(res, {
    message: "Purchased Subscription retrieved successfully!",
    data: result,
  });
});

export const PurchasedPlanController = {
  createPurchasedPlan,
  getPurchasedPlans,
  getSinglePurchasedPlan,
  getMyPurchasedPlan,
};
