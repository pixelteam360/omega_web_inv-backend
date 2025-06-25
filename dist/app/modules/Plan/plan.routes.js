"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const plan_validation_1 = require("./plan.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const plan_controller_1 = require("./plan.controller");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), plan_controller_1.PlanController.getPlans)
    .post((0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(plan_validation_1.PlanValidation.CreatePlanValidationSchema), plan_controller_1.PlanController.createPlan);
router
    .route("/:id")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN), plan_controller_1.PlanController.getSinglePlan)
    .put((0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(plan_validation_1.PlanValidation.PlanUpdateSchema), plan_controller_1.PlanController.updatePlan)
    .delete((0, auth_1.default)(client_1.UserRole.ADMIN), plan_controller_1.PlanController.deletePlan);
exports.PlanRoutes = router;
