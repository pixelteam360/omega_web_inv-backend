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

const createDiscountCode = catchAsync(async (req, res) => {
  const result = await AdminService.createDiscountCode(req.body);
  sendResponse(res, {
    message: "DiscountCode Cerated successfully!",
    data: result,
  });
});

const getAllDiscountCode = catchAsync(async (req, res) => {
  const result = await AdminService.getAllDiscountCode();
  sendResponse(res, {
    message: "DiscountCode retrieved successfully!",
    data: result,
  });
});

const deleteConversation = catchAsync(async (req, res) => {
  const result = await AdminService.deleteConversation();
  sendResponse(res, {
    message: "All conversation deleted",
    data: result,
  });
});

export const AdminController = {
  dashboardOverView,
  userProgress,
  createDiscountCode,
  getAllDiscountCode,
  deleteConversation,
};
