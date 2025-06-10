import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { FitnessGoalService } from "./fitnessGoal.service";
import pick from "../../../shared/pick";

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
    message: "FitnessGoals retrieve successfully!",
    data: result,
  });
});

const getSingleFitnessGoal = catchAsync(async (req, res) => {
  const result = await FitnessGoalService.getSingleFitnessGoal(req.params.id);
  sendResponse(res, {
    message: "FitnessGoal profile retrieved successfully",
    data: result,
  });
});

const updateFitnessGoal = catchAsync(async (req, res) => {
  const result = await FitnessGoalService.updateFitnessGoal(
    req.body,
    req.params.id
  );
  sendResponse(res, {
    message: "Profile updated successfully!",
    data: result,
  });
});

export const FitnessGoalController = {
  createFitnessGoal,
  getFitnessGoals,
  getSingleFitnessGoal,
  updateFitnessGoal,
};
