"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const post_validation_1 = require("./post.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const notification_controller_1 = require("./notification.controller");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(), notification_controller_1.NotificationController.getAllNotification)
    .post((0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(post_validation_1.NotificationValidation.NotificationSchema), notification_controller_1.NotificationController.sendNotification);
exports.NotificationRoutes = router;
