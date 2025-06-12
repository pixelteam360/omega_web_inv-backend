import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { MealPlansService } from "./mealPlans.service";

const createMealPlans = catchAsync(async (req, res) => {
  const result = await MealPlansService.creatMealPlansIntoDb(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "MealPlans created successfully!",
    data: result,
  });
});

const myMealPlans = catchAsync(async (req, res) => {
  const result = await MealPlansService.myMealPlans(req.user.id);
  sendResponse(res, {
    message: "MealPlanss retrieve successfully!",
    data: result,
  });
});

const getSinglMealPlans = catchAsync(async (req, res) => {
  const result = await MealPlansService.getSinglMealPlans(req.params.id);
  sendResponse(res, {
    message: "MealPlans retrieved successfully",
    data: result,
  });
});

const makeCompletedMealPlans = catchAsync(async (req, res) => {
  const result = await MealPlansService.makeCompletedMealPlans(
    req.user.id,
    req.params.id
  );
  sendResponse(res, {
    message: "MealPlans updated successfully!",
    data: result,
  });
});

export const MealPlansController = {
  createMealPlans,
  myMealPlans,
  getSinglMealPlans,
  makeCompletedMealPlans,
};
