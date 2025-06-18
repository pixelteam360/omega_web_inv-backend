"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfoRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const userInfo_controller_1 = require("./userInfo.controller");
const userInfo_validation_1 = require("./userInfo.validation");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), userInfo_controller_1.UserInfoController.getMyUserInfo)
    .post((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), fileUploader_1.fileUploader.uploadSingle, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(userInfo_validation_1.UserInfoValidation.UserInfoValidationSchema), userInfo_controller_1.UserInfoController.createUserInfo);
router
    .route("/update")
    .put((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), fileUploader_1.fileUploader.uploadSingle, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(userInfo_validation_1.UserInfoValidation.UserInfoUpdateSchema), userInfo_controller_1.UserInfoController.updateUserInfo);
exports.UserInfoRoutes = router;
