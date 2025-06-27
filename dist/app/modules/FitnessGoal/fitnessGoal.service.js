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
exports.FitnessGoalService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const createFitnessGoalIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.fitnessGoal.create({
        data: payload,
    });
    return result;
});
const getFitnessGoalsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.fitnessGoal.findMany();
    return result;
});
const getSingleFitnessGoal = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const FitnessGoalProfile = yield prisma_1.default.fitnessGoal.findUnique({
        where: { id },
    });
    return FitnessGoalProfile;
});
const updateFitnessGoal = (payload, FitnessGoalId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.fitnessGoal.update({
        where: { id: FitnessGoalId },
        data: { title: payload.title },
    });
    return result;
});
const deleteFitnessGoal = (FitnessGoalId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingGoal = yield prisma_1.default.fitnessGoal.findUnique({
        where: { id: FitnessGoalId },
    });
    if (!existingGoal) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Fitness goal not found");
    }
    const result = yield prisma_1.default.fitnessGoal.delete({
        where: { id: FitnessGoalId },
    });
    return {
        message: "Fitness goal deleted successfully",
    };
});
exports.FitnessGoalService = {
    createFitnessGoalIntoDb,
    getFitnessGoalsFromDb,
    getSingleFitnessGoal,
    updateFitnessGoal,
    deleteFitnessGoal,
};
