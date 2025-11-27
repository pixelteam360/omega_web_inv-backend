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

router.delete("/conversation", AdminController.deleteConversation);
router
  .route("/admin-ids")
  .get(auth(UserRole.ADMIN, UserRole.NUTRITION), AdminController.adminIds);
router.get("/user-progress/:id", AdminController.userProgress);

export const AdminRoutes = router;
