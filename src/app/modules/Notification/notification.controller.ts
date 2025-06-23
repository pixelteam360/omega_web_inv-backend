import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { NotificationService } from "./notification.service";

const sendNotificationToAll = catchAsync(async (req, res) => {
  const result = await NotificationService.sendNotificationToAll(req.body);
  sendResponse(res, {
    message: "Notification send successfully",
    data: result,
  });
});

const sendNotificationToPaidUser = catchAsync(async (req, res) => {
  const result = await NotificationService.sendNotificationToPaidUser(req.body);
  sendResponse(res, {
    message: "Notification send successfully",
    data: result,
  });
});

const sendNotificationToUnPaidUser = catchAsync(async (req, res) => {
  const result = await NotificationService.sendNotificationToUnPaidUser(
    req.body
  );
  sendResponse(res, {
    message: "Notification send successfully",
    data: result,
  });
});

export const NotificationController = {
  sendNotificationToAll,
  sendNotificationToPaidUser,
  sendNotificationToUnPaidUser
};
