import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { MealPlansController } from "./mealPlans.controller";
import { MealPlansValidation } from "./mealPlans.validation";

const router = express.Router();

router
  .route("/")
  .get(
    auth(UserRole.ADMIN, UserRole.USER),
    MealPlansController.myMealPlans
  )
  .post(
    auth(UserRole.ADMIN, UserRole.USER),
    validateRequest(MealPlansValidation.MealPlansValidationSchema),
    MealPlansController.createMealPlans
  );

router
  .route("/:id")
  .get(
    auth(UserRole.ADMIN, UserRole.USER),
    MealPlansController.getSinglMealPlans
  )
  .patch(
    auth(UserRole.ADMIN, UserRole.USER),
    MealPlansController.makeCompletedMealPlans
  );

export const MealPlansRoutes = router;
