import express from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get("/dashboard-overview", AdminController.dashboardOverView);
router.get("/user-progress/:id", AdminController.userProgress);

export const AdminRoutes = router;
