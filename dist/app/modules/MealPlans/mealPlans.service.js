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
exports.MealPlansService = exports.deletMealPlans = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const creatMealPlansIntoDb = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const nutrition = yield prisma_1.default.nutrition.findFirst({
        where: { id: payload.nutritionId },
    });
    if (!nutrition) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Nutrition not found");
    }
    const workoutPlan = yield prisma_1.default.mealPlans.findFirst({
        where: { userId, nutritionId: nutrition.id, isCompleted: false },
    });
    if (workoutPlan) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You have already added this meal plan. You need to complete this first");
    }
    const result = yield prisma_1.default.mealPlans.create({
        data: Object.assign(Object.assign({}, payload), { userId }),
    });
    return result;
});
const myMealPlans = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.mealPlans.findMany({
        where: { userId },
        select: {
            id: true,
            isCompleted: true,
            nutrition: {
                select: {
                    id: true,
                    title: true,
                    mealTime: true,
                    fitnessGoal: true,
                    icon: true,
                    nutritionTips: true,
                    nutritionItems: true,
                },
            },
        },
    });
    return result;
});
const getSinglMealPlans = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.mealPlans.findFirst({
        where: { id },
        select: {
            id: true,
            isCompleted: true,
            nutrition: {
                select: {
                    id: true,
                    title: true,
                    mealTime: true,
                    fitnessGoal: true,
                    icon: true,
                    nutritionTips: true,
                    nutritionItems: true,
                },
            },
        },
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Data not found");
    }
    return result;
});
const makeCompletedMealPlans = (userId, MealPlansId) => __awaiter(void 0, void 0, void 0, function* () {
    const MealPlans = yield prisma_1.default.mealPlans.findFirst({
        where: { id: MealPlansId, userId },
    });
    if (!MealPlans) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Workout not found");
    }
    const result = yield prisma_1.default.mealPlans.update({
        where: { id: MealPlans.id },
        data: { isCompleted: true },
    });
    return result;
});
const deletMealPlans = () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.mealPlans.deleteMany();
    console.log("success deleted");
    return { message: "All MealPlans deleted successfully" };
});
exports.deletMealPlans = deletMealPlans;
exports.MealPlansService = {
    creatMealPlansIntoDb,
    myMealPlans,
    getSinglMealPlans,
    makeCompletedMealPlans,
};
