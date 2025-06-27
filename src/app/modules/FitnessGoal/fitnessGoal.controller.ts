import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { FitnessGoalService } from "./fitnessGoal.service";

const createFitnessGoal = catchAsync(async (req, res) => {
  const result = await FitnessGoalService.createFitnessGoalIntoDb(req.body);
  sendResponse(res, {
    message: "FitnessGoal Registered successfully!",
    data: result,
  });
});

const getFitnessGoals = catchAsync(async (req, res) => {
  const result = await FitnessGoalService.getFitnessGoalsFromDb();
  sendResponse(res, {
    message: "Fitness Goals retrieve successfully!",
    data: result,
  });
});

const getSingleFitnessGoal = catchAsync(async (req, res) => {
  const result = await FitnessGoalService.getSingleFitnessGoal(req.params.id);
  sendResponse(res, {
    message: "Fitness Goal retrieved successfully",
    data: result,
  });
});

const updateFitnessGoal = catchAsync(async (req, res) => {
  const result = await FitnessGoalService.updateFitnessGoal(
    req.body,
    req.params.id
  );
  sendResponse(res, {
    message: "Fitness Goal updated successfully!",
    data: result,
  });
});

const deleteFitnessGoal = catchAsync(async (req, res) => {
  const result = await FitnessGoalService.deleteFitnessGoal(req.params.id);
  sendResponse(res, {
    message: "Fitness Goal deleted successfully!",
    data: result,
  });
});

export const FitnessGoalController = {
  createFitnessGoal,
  getFitnessGoals,
  getSingleFitnessGoal,
  updateFitnessGoal,
  deleteFitnessGoal
};
