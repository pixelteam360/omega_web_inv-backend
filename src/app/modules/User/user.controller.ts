import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { userService } from "./user.service";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.costant";

const createUser = catchAsync(async (req, res) => {
  const result = await userService.createUserIntoDb(req.body);
  sendResponse(res, {
    message: "User Registered successfully!",
    data: result,
  });
});

const getUsers = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await userService.getUsersFromDb(filters, options);
  sendResponse(res, {
    message: "Users retrieve successfully!",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const { email } = req.user;
  const result = await userService.getMyProfile(email);
  sendResponse(res, {
    message: "User profile retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const { id } = req?.user;
  const result = await userService.updateProfile(req.body, id);
  sendResponse(res, {
    message: "Profile updated successfully!",
    data: result,
  });
});

const myWeightProgress = catchAsync(async (req, res) => {
  const result = await userService.myWeightProgress(req.user.id);
  sendResponse(res, {
    message: "My WeightProgress retrieved successfully!",
    data: result,
  });
});

const blockUser = catchAsync(async (req, res) => {
  const result = await userService.blockUser(req.params.id);
  sendResponse(res, {
    message: "User status updated successfully!",
    data: result,
  });
});

const deleteUserWithRelations = catchAsync(async (req, res) => {
  const result = await userService.deleteUserWithRelations(req.user.id);
  sendResponse(res, {
    message: "User and all related data deleted successfully",
    data: result,
  });
});

export const userController = {
  createUser,
  getUsers,
  getMyProfile,
  updateProfile,
  myWeightProgress,
  blockUser,
  deleteUserWithRelations
};
