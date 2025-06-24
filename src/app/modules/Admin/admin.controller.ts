import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AdminService } from "./admin.service";

const dashboardOverView = catchAsync(async (req, res) => {
  const result = await AdminService.dashboardOverView();
  sendResponse(res, {
    message: "Dashboard over view retrieved successfully!",
    data: result,
  });
});

const userProgress = catchAsync(async (req, res) => {
  const result = await AdminService.userProgress(req.params.id);
  sendResponse(res, {
    message: "User Progress retrieved successfully!",
    data: result,
  });
});

export const AdminController = {
  dashboardOverView,
  userProgress
};
