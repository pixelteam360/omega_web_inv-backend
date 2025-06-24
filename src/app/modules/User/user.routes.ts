import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router
  .route("/")
  .get(userController.getUsers)
  .post(
    validateRequest(UserValidation.CreateUserValidationSchema),
    userController.createUser
  );

router.get("/weightProgress", auth(), userController.myWeightProgress);

router
  .route("/profile")
  .get(auth(UserRole.ADMIN, UserRole.USER), userController.getMyProfile)
  .put(auth(UserRole.ADMIN, UserRole.USER), userController.updateProfile);

export const UserRoutes = router;
