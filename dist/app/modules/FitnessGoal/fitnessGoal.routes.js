"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FitnessGoalRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const fitnessGoal_validation_1 = require("./fitnessGoal.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fitnessGoal_controller_1 = require("./fitnessGoal.controller");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router
    .route("/")
    .get(fitnessGoal_controller_1.FitnessGoalController.getFitnessGoals)
    .post((0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(fitnessGoal_validation_1.FitnessGoalValidation.FitnessGoalValidationSchema), fitnessGoal_controller_1.FitnessGoalController.createFitnessGoal);
router
    .route("/:id")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN), fitnessGoal_controller_1.FitnessGoalController.getSingleFitnessGoal)
    .put((0, auth_1.default)(client_1.UserRole.ADMIN), fitnessGoal_controller_1.FitnessGoalController.updateFitnessGoal);
exports.FitnessGoalRoutes = router;
