import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { NotificationValidation } from "./post.validation";
import auth from "../../middlewares/auth";
import { NotificationController } from "./notification.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router
  .route("/all")
  .post(
    auth(UserRole.ADMIN),
    validateRequest(NotificationValidation.NotificationSchema),
    NotificationController.sendNotificationToAll
  );

router.post(
  "/paid",
  auth(UserRole.ADMIN),
  validateRequest(NotificationValidation.NotificationSchema),
  NotificationController.sendNotificationToPaidUser
);

router.post(
  "/unpaid",
  auth(UserRole.ADMIN),
  validateRequest(NotificationValidation.NotificationSchema),
  NotificationController.sendNotificationToUnPaidUser
);

export const NotificationRoutes = router;
