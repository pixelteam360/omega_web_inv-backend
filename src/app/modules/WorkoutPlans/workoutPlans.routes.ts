import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { WorkoutPlansController } from "./workoutPlans.controller";
import { WorkoutPlansValidation } from "./workoutPlans.validation";

const router = express.Router();

router
  .route("/")
  .get(
    auth(UserRole.ADMIN, UserRole.USER),
    WorkoutPlansController.myWorkoutPlans
  )
  .post(
    auth(UserRole.ADMIN, UserRole.USER),
    validateRequest(WorkoutPlansValidation.WorkoutPlansValidationSchema),
    WorkoutPlansController.createWorkoutPlans
  );

router
  .route("/:id")
  .get(
    auth(UserRole.ADMIN, UserRole.USER),
    WorkoutPlansController.getSinglWorkoutPlans
  )
  .patch(
    auth(UserRole.ADMIN, UserRole.USER),
    WorkoutPlansController.makeCompletedWorkoutPlans
  );

export const WorkoutPlansRoutes = router;
