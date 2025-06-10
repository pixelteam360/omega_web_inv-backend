import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { WorkoutValidation } from "./workout.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";
import { WorkoutController } from "./workout.controller";

const router = express.Router();

router
  .route("/")
  .get(WorkoutController.getWorkouts)
  .post(
    auth(UserRole.ADMIN),
    fileUploader.workout,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(WorkoutValidation.WorkoutValidationSchema),
    WorkoutController.createWorkout
  );

router
  .route("/:id")
  .get(auth(UserRole.ADMIN, UserRole.USER), WorkoutController.getSingleWorkout)
  .put(
    auth(UserRole.ADMIN, UserRole.USER),
    fileUploader.workout,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(WorkoutValidation.WorkoutUpdateSchema),
    WorkoutController.updateWorkout
  )
  .delete(auth(UserRole.ADMIN, UserRole.USER), WorkoutController.deleteWorkout);

export const WorkoutRoutes = router;
