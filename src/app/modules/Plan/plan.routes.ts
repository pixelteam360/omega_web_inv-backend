import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PlanValidation } from "./plan.validation";
import auth from "../../middlewares/auth";
import { PlanController } from "./plan.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router
  .route("/")
  .get(auth(UserRole.ADMIN, UserRole.USER), PlanController.getPlans)
  .post(
    auth(UserRole.ADMIN),
    validateRequest(PlanValidation.CreatePlanValidationSchema),
    PlanController.createPlan
  );

router
  .route("/:id")
  .get(
    auth(UserRole.ADMIN),
    PlanController.getSinglePlan
  )
  .put(
    auth(UserRole.ADMIN),
    validateRequest(PlanValidation.PlanUpdateSchema),
    PlanController.updatePlan
  )
  .delete(auth(UserRole.ADMIN), PlanController.deletePlan);

export const PlanRoutes = router;
