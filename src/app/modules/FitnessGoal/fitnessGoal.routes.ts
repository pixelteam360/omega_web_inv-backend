import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { FitnessGoalValidation } from "./fitnessGoal.validation";
import auth from "../../middlewares/auth";
import { FitnessGoalController } from "./fitnessGoal.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router
  .route("/")
  .get(FitnessGoalController.getFitnessGoals)
  .post(
    auth(UserRole.ADMIN),
    validateRequest(FitnessGoalValidation.FitnessGoalValidationSchema),
    FitnessGoalController.createFitnessGoal
  );

router
  .route("/:id")
  .get(auth(UserRole.ADMIN), FitnessGoalController.getSingleFitnessGoal)
  .put(auth(UserRole.ADMIN), FitnessGoalController.updateFitnessGoal)
  .delete(auth(UserRole.ADMIN), FitnessGoalController.deleteFitnessGoal);

export const FitnessGoalRoutes = router;
