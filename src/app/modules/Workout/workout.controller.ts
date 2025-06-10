import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { WorkoutService } from "./workout.service";
import pick from "../../../shared/pick";
import { workoutFilterableFields } from "./workout.costant";

const createWorkout = catchAsync(async (req, res) => {
  const files = req.files as any;

  const thumbnailFile =
    Array.isArray(files?.thumbnail) && files.thumbnail.length > 0
      ? files.thumbnail[0]
      : undefined;

  const iconFile =
    Array.isArray(files?.icon) && files.icon.length > 0
      ? files.icon[0]
      : undefined;

  const videoFile =
    Array.isArray(files?.videos) && files.videos.length > 0 ? files.videos : [];

  const result = await WorkoutService.createWorkoutIntoDb(
    req.body,
    thumbnailFile,
    iconFile,
    videoFile
  );
  sendResponse(res, {
    message: "Workout created successfully!",
    data: result,
  });
});

const getWorkouts = catchAsync(async (req, res) => {
  const filters = pick(req.query, workoutFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await WorkoutService.getWorkoutsFromDb(filters, options);
  sendResponse(res, {
    message: "Workouts retrieve successfully!",
    data: result,
  });
});

const getSingleWorkout = catchAsync(async (req, res) => {
  const result = await WorkoutService.getSingleWorkout(req.params.id);
  sendResponse(res, {
    message: "Workout retrieved successfully",
    data: result,
  });
});

const updateWorkout = catchAsync(async (req, res) => {
  const files = req.files as any;

  const thumbnailFile =
    Array.isArray(files?.thumbnail) && files.thumbnail.length > 0
      ? files.thumbnail[0]
      : undefined;

  const iconFile =
    Array.isArray(files?.icon) && files.icon.length > 0
      ? files.icon[0]
      : undefined;

  const videoFile =
    Array.isArray(files?.videos) && files.videos.length > 0 ? files.videos : [];

  const result = await WorkoutService.updateWorkout(
    req.body,
    req.params.id,
    thumbnailFile,
    iconFile,
    videoFile
  );
  sendResponse(res, {
    message: "Profile updated successfully!",
    data: result,
  });
});

const deleteWorkout = catchAsync(async (req, res) => {
  const result = await WorkoutService.deleteWorkout(req.params.id);
  sendResponse(res, {
    message: "Workout deleted successfully",
    data: result,
  });
});

export const WorkoutController = {
  createWorkout,
  getWorkouts,
  getSingleWorkout,
  updateWorkout,
  deleteWorkout
};
