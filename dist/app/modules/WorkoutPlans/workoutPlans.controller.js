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
exports.WorkoutPlansController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const workoutPlans_service_1 = require("./workoutPlans.service");
const createWorkoutPlans = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield workoutPlans_service_1.WorkoutPlansService.creatWorkoutPlansIntoDb(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "WorkoutPlans created successfully!",
        data: result,
    });
}));
const myWorkoutPlans = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield workoutPlans_service_1.WorkoutPlansService.myWorkoutPlans(req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "WorkoutPlanss retrieve successfully!",
        data: result,
    });
}));
const getSinglWorkoutPlans = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield workoutPlans_service_1.WorkoutPlansService.getSinglWorkoutPlans(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "WorkoutPlans retrieved successfully",
        data: result,
    });
}));
const makeCompletedWorkoutPlans = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield workoutPlans_service_1.WorkoutPlansService.makeCompletedWorkoutPlans(req.user.id, req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "WorkoutPlans updated successfully!",
        data: result,
    });
}));
exports.WorkoutPlansController = {
    createWorkoutPlans,
    myWorkoutPlans,
    getSinglWorkoutPlans,
    makeCompletedWorkoutPlans,
};
