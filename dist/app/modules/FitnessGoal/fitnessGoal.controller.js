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
exports.FitnessGoalController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const fitnessGoal_service_1 = require("./fitnessGoal.service");
const createFitnessGoal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fitnessGoal_service_1.FitnessGoalService.createFitnessGoalIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        message: "FitnessGoal Registered successfully!",
        data: result,
    });
}));
const getFitnessGoals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fitnessGoal_service_1.FitnessGoalService.getFitnessGoalsFromDb();
    (0, sendResponse_1.default)(res, {
        message: "Fitness Goals retrieve successfully!",
        data: result,
    });
}));
const getSingleFitnessGoal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fitnessGoal_service_1.FitnessGoalService.getSingleFitnessGoal(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Fitness Goal retrieved successfully",
        data: result,
    });
}));
const updateFitnessGoal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fitnessGoal_service_1.FitnessGoalService.updateFitnessGoal(req.body, req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Fitness Goal updated successfully!",
        data: result,
    });
}));
const deleteFitnessGoal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fitnessGoal_service_1.FitnessGoalService.deleteFitnessGoal(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Fitness Goal deleted successfully!",
        data: result,
    });
}));
exports.FitnessGoalController = {
    createFitnessGoal,
    getFitnessGoals,
    getSingleFitnessGoal,
    updateFitnessGoal,
    deleteFitnessGoal
};
