"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const admin_validation_1 = require("./admin.validation");
const router = express_1.default.Router();
router.get("/dashboard-overview", admin_controller_1.AdminController.dashboardOverView);
router
    .route("/discount-code")
    .get((0, auth_1.default)(), admin_controller_1.AdminController.getAllDiscountCode)
    .post((0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(admin_validation_1.AdminValidation.DiscountCodeSchema), admin_controller_1.AdminController.createDiscountCode);
router.get("/user-progress/:id", admin_controller_1.AdminController.userProgress);
exports.AdminRoutes = router;
