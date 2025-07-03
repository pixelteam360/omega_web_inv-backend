import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { NotificationService } from "./notification.service";
import { notificationFilterableFields } from "./user.costant";

const sendNotification = catchAsync(async (req, res) => {
  const result = await NotificationService.sendNotification(req.body);
  sendResponse(res, {
    message: "Notification send successfully",
    data: result,
  });
});

const getAllNotification = catchAsync(async (req, res) => {
  const filters = pick(req.query, notificationFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await NotificationService.getAllNotification(filters, options);
  sendResponse(res, {
    message: "Notifications retrieve successfully!",
    data: result,
  });
});

export const NotificationController = {
  sendNotification,
  getAllNotification
};
