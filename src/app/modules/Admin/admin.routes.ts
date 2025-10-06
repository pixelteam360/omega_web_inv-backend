import express from "express";
import { AdminController } from "./admin.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidation } from "./admin.validation";

const router = express.Router();

router.get("/dashboard-overview", AdminController.dashboardOverView);

router
  .route("/discount-code")
  .get(auth(), AdminController.getAllDiscountCode)
  .post(
    auth(UserRole.ADMIN),
    validateRequest(AdminValidation.DiscountCodeSchema),
    AdminController.createDiscountCode
  );

router.get("/user-progress/:id", AdminController.userProgress);
router.delete("/conversation", AdminController.deleteConversation);

export const AdminRoutes = router;
