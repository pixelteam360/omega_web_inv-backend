"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutPlansRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const workoutPlans_controller_1 = require("./workoutPlans.controller");
const workoutPlans_validation_1 = require("./workoutPlans.validation");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), workoutPlans_controller_1.WorkoutPlansController.myWorkoutPlans)
    .post((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), (0, validateRequest_1.default)(workoutPlans_validation_1.WorkoutPlansValidation.WorkoutPlansValidationSchema), workoutPlans_controller_1.WorkoutPlansController.createWorkoutPlans);
router
    .route("/:id")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), workoutPlans_controller_1.WorkoutPlansController.getSinglWorkoutPlans)
    .patch((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), workoutPlans_controller_1.WorkoutPlansController.makeCompletedWorkoutPlans);
exports.WorkoutPlansRoutes = router;
