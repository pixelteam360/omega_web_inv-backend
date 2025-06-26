import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { PurchasedPlanController } from "./purchasedPlan.controller";
import { UserRole } from "@prisma/client";
import { PurchasedPlanValidation } from "./purchasedPlan.validation";

const router = express.Router();

router
  .route("/")
  .get(PurchasedPlanController.getPurchasedPlans)
  .post(
    auth(UserRole.USER, UserRole.ADMIN),
    validateRequest(
      PurchasedPlanValidation.CreatePurchasedPlanValidationSchema
    ),
    PurchasedPlanController.createPurchasedPlan
  );

router.get(
  "/my-purchased",
  auth(UserRole.USER, UserRole.ADMIN),
  PurchasedPlanController.getMyPurchasedPlan
);

router
  .route("/:id")
  .get(auth(UserRole.USER, UserRole.ADMIN), PurchasedPlanController.getSinglePurchasedPlan);

export const PurchasedPlanRoutes = router;
