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
exports.PurchasedPlanController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const purchasedPlan_service_1 = require("./purchasedPlan.service");
const createPurchasedPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield purchasedPlan_service_1.PurchasedPlanService.createPurchasedPlanIntoDb(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Purchased Subscription successfully!",
        data: result,
    });
}));
const getPurchasedPlans = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield purchasedPlan_service_1.PurchasedPlanService.getPurchasedPlansFromDb();
    (0, sendResponse_1.default)(res, {
        message: "Purchased Subscriptions retrieve successfully!",
        data: result,
    });
}));
const getSinglePurchasedPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield purchasedPlan_service_1.PurchasedPlanService.getSinglePurchasedPlan(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Purchased Subscription retrieved successfully",
        data: result,
    });
}));
const getMyPurchasedPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.user;
    const result = yield purchasedPlan_service_1.PurchasedPlanService.getMyPurchasedPlan(id);
    (0, sendResponse_1.default)(res, {
        message: "Purchased Subscription retrieved successfully!",
        data: result,
    });
}));
exports.PurchasedPlanController = {
    createPurchasedPlan,
    getPurchasedPlans,
    getSinglePurchasedPlan,
    getMyPurchasedPlan,
};
