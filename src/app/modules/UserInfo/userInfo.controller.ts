import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserInfoService } from "./userInfo.service";

const createUserInfo = catchAsync(async (req, res) => {
  const result = await UserInfoService.createUserInfoIntoDb(
    req.body,
    req.user.id,
    req.file
  );
  sendResponse(res, {
    message: "UserInfo Registered successfully!",
    data: result,
  });
});

const getMyUserInfo = catchAsync(async (req, res) => {
  const result = await UserInfoService.getMyUserInfo(req.user.id);
  sendResponse(res, {
    message: "User Info retrieved successfully",
    data: result,
  });
});

const updateUserInfo = catchAsync(async (req, res) => {
  const { id } = req?.user;
  const result = await UserInfoService.updateUserInfo(req.body, req.file, id);
  sendResponse(res, {
    message: "Profile updated successfully!",
    data: result,
  });
});

export const UserInfoController = {
  createUserInfo,
  getMyUserInfo,
  updateUserInfo,
};
