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
exports.AdminService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const notification_service_1 = require("../Notification/notification.service");
const dashboardOverView = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.count();
    const plans = yield prisma_1.default.plan.count();
    const fitnessGoal = yield prisma_1.default.fitnessGoal.count();
    const workout = yield prisma_1.default.workout.count();
    const nutrition = yield prisma_1.default.nutrition.count();
    const progress = yield prisma_1.default.user.count();
    const trainerSupport = yield prisma_1.default.room.count({
        where: { roomType: "TRAINER" },
    });
    const nutritionSupport = yield prisma_1.default.room.count({
        where: { roomType: "NUTRITION" },
    });
    return {
        users,
        plans,
        fitnessGoal,
        workout,
        nutrition,
        progress,
        trainerSupport,
        nutritionSupport,
    };
});
const userProgress = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const res = yield prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            userInfo: true,
            bodyMeasurement: true,
            weightProgress: true,
            purchasedPlan: {
                select: {
                    id: true,
                    activePlan: true,
                    startDate: true,
                    endDate: true,
                    amount: true,
                    Plan: true,
                },
            },
        },
    });
    const workout = yield prisma_1.default.workoutPlans.findMany({
        where: { userId: id },
        select: { id: true, isCompleted: true, workout: true },
    });
    const meal = yield prisma_1.default.mealPlans.findMany({
        where: { userId: id },
        select: {
            id: true,
            isCompleted: true,
            nutrition: true,
        },
    });
    const startWeight = ((_b = (_a = res === null || res === void 0 ? void 0 : res.weightProgress) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.weight) || 0;
    const endWeight = ((_e = (_c = res === null || res === void 0 ? void 0 : res.weightProgress) === null || _c === void 0 ? void 0 : _c[((_d = res === null || res === void 0 ? void 0 : res.weightProgress) === null || _d === void 0 ? void 0 : _d.length) - 1]) === null || _e === void 0 ? void 0 : _e.weight) || 0;
    return Object.assign(Object.assign({}, res), { startWeight, endWeight, workout, meal });
});
const createDiscountCode = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const discount = yield prisma_1.default.discountCode.findFirst({
        where: { code: payload.code },
    });
    if (discount) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "This discount code already exists");
    }
    const res = yield prisma_1.default.discountCode.create({
        data: payload,
    });
    const notification = {
        title: "New Discount Code 🎁",
        body: `You have received a discount code that gives you ${payload.discount}% off on all plans. Your code: ${payload.code}`,
        type: payload.userType,
    };
    yield (0, notification_service_1.sendNotification)(notification);
    return res;
});
const getAllDiscountCode = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield prisma_1.default.discountCode.findMany();
    return res;
});
exports.AdminService = {
    dashboardOverView,
    userProgress,
    createDiscountCode,
    getAllDiscountCode,
};
