import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { WorkoutPlansService } from "./workoutPlans.service";

const createWorkoutPlans = catchAsync(async (req, res) => {
  const result = await WorkoutPlansService.creatWorkoutPlansIntoDb(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "Workout Plan created successfully!",
    data: result,
  });
});

const myWorkoutPlans = catchAsync(async (req, res) => {
  const result = await WorkoutPlansService.myWorkoutPlans(req.user.id);
  sendResponse(res, {
    message: "WorkoutPlanss retrieve successfully!",
    data: result,
  });
});

const getSinglWorkoutPlans = catchAsync(async (req, res) => {
  const result = await WorkoutPlansService.getSinglWorkoutPlans(req.params.id);
  sendResponse(res, {
    message: "Workout Plans retrieved successfully",
    data: result,
  });
});

const makeCompletedWorkoutPlans = catchAsync(async (req, res) => {
  const result = await WorkoutPlansService.makeCompletedWorkoutPlans(
    req.user.id,
    req.params.id
  );
  sendResponse(res, {
    message: "Workout Plan updated successfully!",
    data: result,
  });
});

export const WorkoutPlansController = {
  createWorkoutPlans,
  myWorkoutPlans,
  getSinglWorkoutPlans,
  makeCompletedWorkoutPlans,
};
