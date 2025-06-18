"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyMeasurementRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const bodyMeasurement_validation_1 = require("./bodyMeasurement.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const bodyMeasurement_controller_1 = require("./bodyMeasurement.controller");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), bodyMeasurement_controller_1.BodyMeasurementController.getBodyMeasurements)
    .post((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), (0, validateRequest_1.default)(bodyMeasurement_validation_1.BodyMeasurementValidation.BodyMeasurementValidationSchema), bodyMeasurement_controller_1.BodyMeasurementController.createBodyMeasurement)
    .put((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), (0, validateRequest_1.default)(bodyMeasurement_validation_1.BodyMeasurementValidation.BodyMeasurementUpdateSchema), bodyMeasurement_controller_1.BodyMeasurementController.updateBodyMeasurement);
router
    .route("/:id")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), bodyMeasurement_controller_1.BodyMeasurementController.getSingleBodyMeasurement);
exports.BodyMeasurementRoutes = router;
