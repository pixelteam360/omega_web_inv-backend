import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { BodyMeasurementValidation } from "./bodyMeasurement.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";
import { BodyMeasurementController } from "./bodyMeasurement.controller";

const router = express.Router();

router
  .route("/")
  .get(
    auth(UserRole.ADMIN, UserRole.USER),
    BodyMeasurementController.getBodyMeasurements
  )
  .post(
    auth(UserRole.ADMIN, UserRole.USER),
    validateRequest(BodyMeasurementValidation.BodyMeasurementValidationSchema),
    BodyMeasurementController.createBodyMeasurement
  )
  .put(
    auth(UserRole.ADMIN, UserRole.USER),
    validateRequest(BodyMeasurementValidation.BodyMeasurementUpdateSchema),
    BodyMeasurementController.updateBodyMeasurement
  );

router
  .route("/:id")
  .get(
    auth(UserRole.ADMIN, UserRole.USER),
    BodyMeasurementController.getSingleBodyMeasurement
  );

export const BodyMeasurementRoutes = router;
