"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealPlansRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const mealPlans_controller_1 = require("./mealPlans.controller");
const mealPlans_validation_1 = require("./mealPlans.validation");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), mealPlans_controller_1.MealPlansController.myMealPlans)
    .post((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), (0, validateRequest_1.default)(mealPlans_validation_1.MealPlansValidation.MealPlansValidationSchema), mealPlans_controller_1.MealPlansController.createMealPlans);
router
    .route("/:id")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), mealPlans_controller_1.MealPlansController.getSinglMealPlans)
    .patch((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), mealPlans_controller_1.MealPlansController.makeCompletedMealPlans);
exports.MealPlansRoutes = router;
