import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { NotificationService } from "./notification.service";

const sendNotification = catchAsync(async (req, res) => {
  const result = await NotificationService.sendNotification(req.body);
  sendResponse(res, {
    message: "Notification send successfully",
    data: result,
  });
});

export const NotificationController = {
  sendNotification,
};
