import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";
import { NutritionController } from "./nutrition.controller";
import { NutritiontValidation } from "./nutrition.validation";

const router = express.Router();

router
  .route("/")
  .get(NutritionController.getNutritions)
  .post(
    auth(UserRole.ADMIN),
    fileUploader.nutrition,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(NutritiontValidation.NutritiontValidationSchema),
    NutritionController.createNutrition
  );

router
  .route("/:id")
  .get(auth(UserRole.ADMIN, UserRole.USER), NutritionController.getSingleNutrition)
  .put(
    auth(UserRole.ADMIN, UserRole.USER),
    fileUploader.nutrition,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(NutritiontValidation.NutritiontUpdateSchema),
    NutritionController.updateNutrition
  )
  .delete(auth(UserRole.ADMIN, UserRole.USER), NutritionController.deleteNutrition);

export const NutritionRoutes = router;
