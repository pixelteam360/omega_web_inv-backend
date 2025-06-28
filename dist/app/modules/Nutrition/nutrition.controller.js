"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const nutrition_service_1 = require("./nutrition.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const nutrition_costant_1 = require("./nutrition.costant");
const createNutrition = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield nutrition_service_1.NutritionService.createNutritionIntoDb(req.body, req.files);
    (0, sendResponse_1.default)(res, {
        message: "Nutrition created successfully!",
        data: result,
    });
}));
const getNutritions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, nutrition_costant_1.nutritionFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield nutrition_service_1.NutritionService.getNutritionsFromDb(filters, options);
    (0, sendResponse_1.default)(res, {
        message: "Nutritions retrieve successfully!",
        data: result,
    });
}));
const getSingleNutrition = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield nutrition_service_1.NutritionService.getSingleNutrition(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Nutrition retrieved successfully",
        data: result,
    });
}));
const updateNutrition = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const iconFile = Array.isArray(files === null || files === void 0 ? void 0 : files.icon) && files.icon.length > 0
        ? files.icon[0]
        : undefined;
    const nutritionTipsFile = Array.isArray(files === null || files === void 0 ? void 0 : files.nutritionTips) && files.nutritionTips.length > 0
        ? files.nutritionTips[0]
        : undefined;
    const result = yield nutrition_service_1.NutritionService.updateNutrition(req.body, req.params.id, iconFile, nutritionTipsFile);
    (0, sendResponse_1.default)(res, {
        message: "Nutrition updated successfully!",
        data: result,
    });
}));
const deleteNutrition = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield nutrition_service_1.NutritionService.deleteNutrition(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Nutrition deleted successfully",
        data: result,
    });
}));
exports.NutritionController = {
    createNutrition,
    getNutritions,
    getSingleNutrition,
    updateNutrition,
    deleteNutrition,
};
