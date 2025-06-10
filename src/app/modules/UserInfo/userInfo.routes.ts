import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
import { UserInfoController } from "./userInfo.controller";
import { UserInfoValidation } from "./userInfo.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

router
  .route("/")
  .get(auth(UserRole.ADMIN, UserRole.USER), UserInfoController.getMyUserInfo)
  .post(
    auth(UserRole.ADMIN, UserRole.USER),
    fileUploader.uploadSingle,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(UserInfoValidation.UserInfoValidationSchema),
    UserInfoController.createUserInfo
  );

router
  .route("/update")
  .put(
    auth(UserRole.ADMIN, UserRole.USER),
    fileUploader.uploadSingle,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(UserInfoValidation.UserInfoUpdateSchema),
    UserInfoController.updateUserInfo
  );

export const UserInfoRoutes = router;
