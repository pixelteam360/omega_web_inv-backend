"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const workout_validation_1 = require("./workout.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helpars/fileUploader");
const workout_controller_1 = require("./workout.controller");
const router = express_1.default.Router();
router
    .route("/")
    .get(workout_controller_1.WorkoutController.getWorkouts)
    .post((0, auth_1.default)(client_1.UserRole.ADMIN), fileUploader_1.fileUploader.workout, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(workout_validation_1.WorkoutValidation.WorkoutValidationSchema), workout_controller_1.WorkoutController.createWorkout);
router
    .route("/:id")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), workout_controller_1.WorkoutController.getSingleWorkout)
    .put((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), fileUploader_1.fileUploader.workout, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(workout_validation_1.WorkoutValidation.WorkoutUpdateSchema), workout_controller_1.WorkoutController.updateWorkout)
    .delete((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), workout_controller_1.WorkoutController.deleteWorkout);
exports.WorkoutRoutes = router;
