"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helpars/fileUploader");
const nutrition_controller_1 = require("./nutrition.controller");
const nutrition_validation_1 = require("./nutrition.validation");
const router = express_1.default.Router();
router
    .route("/")
    .get(nutrition_controller_1.NutritionController.getNutritions)
    .post((0, auth_1.default)(client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.any(), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, nutrition_controller_1.NutritionController.createNutrition);
router.route("/edamam").get(nutrition_controller_1.NutritionController.edamamData);
router
    .route("/:id")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), nutrition_controller_1.NutritionController.getSingleNutrition)
    .put((0, auth_1.default)(client_1.UserRole.ADMIN), fileUploader_1.fileUploader.nutrition, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(nutrition_validation_1.NutritiontValidation.NutritiontUpdateSchema), nutrition_controller_1.NutritionController.updateNutrition)
    .delete((0, auth_1.default)(client_1.UserRole.ADMIN), nutrition_controller_1.NutritionController.deleteNutrition);
exports.NutritionRoutes = router;
