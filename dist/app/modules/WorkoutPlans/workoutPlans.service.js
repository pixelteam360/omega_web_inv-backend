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
exports.WorkoutPlansService = exports.deletWorkoutPlans = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const creatWorkoutPlansIntoDb = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const workout = yield prisma_1.default.workout.findFirst({
        where: { id: payload.workoutId },
    });
    if (!workout) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Workout not found");
    }
    const workoutPlan = yield prisma_1.default.workoutPlans.findFirst({
        where: { userId, workoutId: workout.id, isCompleted: false },
    });
    if (workoutPlan) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You have already added this meal plan. You need to complete this first");
    }
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        select: { id: true, activePlan: true },
    });
    const workoutPlansCount = yield prisma_1.default.workoutPlans.count({
        where: { userId },
    });
    if (workoutPlansCount >= 5 && (user === null || user === void 0 ? void 0 : user.activePlan) === false) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You can only add up to 5 workout in free plan");
    }
    const result = yield prisma_1.default.workoutPlans.create({
        data: Object.assign(Object.assign({}, payload), { userId }),
    });
    return result;
});
const myWorkoutPlans = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.workoutPlans.findMany({
        where: { userId },
        select: {
            id: true,
            isCompleted: true,
            workout: true,
        },
    });
    return result;
});
const getSinglWorkoutPlans = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.workoutPlans.findFirst({
        where: { id },
        select: {
            id: true,
            isCompleted: true,
            workout: true,
        },
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Data not found");
    }
    return result;
});
const makeCompletedWorkoutPlans = (userId, WorkoutPlansId) => __awaiter(void 0, void 0, void 0, function* () {
    const WorkoutPlans = yield prisma_1.default.workoutPlans.findFirst({
        where: { id: WorkoutPlansId, userId },
        select: {
            id: true,
            isCompleted: true,
            workout: {
                select: {
                    id: true,
                    Kcal: true,
                },
            },
        },
    });
    if (!WorkoutPlans) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Workout Plans not found");
    }
    const dailyGoal = yield prisma_1.default.dailyGoal.findFirst({
        where: { userId },
        select: { id: true, CaloriesBurned: true },
    });
    const totalBurned = (dailyGoal === null || dailyGoal === void 0 ? void 0 : dailyGoal.CaloriesBurned) + WorkoutPlans.workout.Kcal;
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const updatePlan = yield prisma.workoutPlans.update({
            where: { id: WorkoutPlans.id },
            data: { isCompleted: true },
        });
        yield prisma.dailyGoal.update({
            where: { id: dailyGoal === null || dailyGoal === void 0 ? void 0 : dailyGoal.id },
            data: { CaloriesBurned: totalBurned },
        });
        return updatePlan;
    }));
    return result;
});
const deletWorkoutPlans = () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.workoutPlans.deleteMany();
        yield prisma.dailyGoal.updateMany({
            data: { CaloriesBurned: 0, CaloriesConsumed: 0 },
        });
    }));
    return { message: "All WorkoutPlans deleted successfully" };
});
exports.deletWorkoutPlans = deletWorkoutPlans;
exports.WorkoutPlansService = {
    creatWorkoutPlansIntoDb,
    myWorkoutPlans,
    getSinglWorkoutPlans,
    makeCompletedWorkoutPlans,
};
