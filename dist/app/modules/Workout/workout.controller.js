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
exports.WorkoutController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const workout_service_1 = require("./workout.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const workout_costant_1 = require("./workout.costant");
const createWorkout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const thumbnailFile = Array.isArray(files === null || files === void 0 ? void 0 : files.thumbnail) && files.thumbnail.length > 0
        ? files.thumbnail[0]
        : undefined;
    const iconFile = Array.isArray(files === null || files === void 0 ? void 0 : files.icon) && files.icon.length > 0
        ? files.icon[0]
        : undefined;
    const videoFile = Array.isArray(files === null || files === void 0 ? void 0 : files.video) && files.video.length > 0
        ? files.video[0]
        : undefined;
    const result = yield workout_service_1.WorkoutService.createWorkoutIntoDb(req.body, thumbnailFile, iconFile, videoFile);
    (0, sendResponse_1.default)(res, {
        message: "Workout created successfully!",
        data: result,
    });
}));
const getWorkouts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, workout_costant_1.workoutFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield workout_service_1.WorkoutService.getWorkoutsFromDb(filters, options);
    (0, sendResponse_1.default)(res, {
        message: "Workouts retrieve successfully!",
        data: result,
    });
}));
const getSingleWorkout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield workout_service_1.WorkoutService.getSingleWorkout(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Workout retrieved successfully",
        data: result,
    });
}));
const updateWorkout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const thumbnailFile = Array.isArray(files === null || files === void 0 ? void 0 : files.thumbnail) && files.thumbnail.length > 0
        ? files.thumbnail[0]
        : undefined;
    const iconFile = Array.isArray(files === null || files === void 0 ? void 0 : files.icon) && files.icon.length > 0
        ? files.icon[0]
        : undefined;
    const videoFile = Array.isArray(files === null || files === void 0 ? void 0 : files.video) && files.video.length > 0
        ? files.video[0]
        : undefined;
    const result = yield workout_service_1.WorkoutService.updateWorkout(req.body, req.params.id, thumbnailFile, iconFile, videoFile);
    (0, sendResponse_1.default)(res, {
        message: "Profile updated successfully!",
        data: result,
    });
}));
const deleteWorkout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield workout_service_1.WorkoutService.deleteWorkout(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Workout deleted successfully",
        data: result,
    });
}));
exports.WorkoutController = {
    createWorkout,
    getWorkouts,
    getSingleWorkout,
    updateWorkout,
    deleteWorkout,
};
