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
exports.AdminController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const admin_service_1 = require("./admin.service");
const dashboardOverView = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.dashboardOverView();
    (0, sendResponse_1.default)(res, {
        message: "Dashboard over view retrieved successfully!",
        data: result,
    });
}));
const userProgress = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.userProgress(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "User Progress retrieved successfully!",
        data: result,
    });
}));
const createDiscountCode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.createDiscountCode(req.body);
    (0, sendResponse_1.default)(res, {
        message: "DiscountCode Cerated successfully!",
        data: result,
    });
}));
const getAllDiscountCode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.getAllDiscountCode();
    (0, sendResponse_1.default)(res, {
        message: "DiscountCode retrieved successfully!",
        data: result,
    });
}));
exports.AdminController = {
    dashboardOverView,
    userProgress,
    createDiscountCode,
    getAllDiscountCode
};
