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
exports.PlanService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createPlanIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.plan.create({
        data: payload,
    });
    return result;
});
const getPlansFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const Plan = yield prisma_1.default.plan.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
    });
    return Plan;
});
const getSinglePlan = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const PlanProfile = yield prisma_1.default.plan.findUnique({
        where: { id, isDeleted: false },
    });
    return PlanProfile;
});
const updatePlan = (payload, PlanId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.plan.update({
        where: { id: PlanId, isDeleted: false },
        data: payload,
    });
    return result;
});
const deletePlan = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.plan.update({
        where: { id },
        data: { isDeleted: true },
    });
    return { message: "Plan deleted successfully" };
});
exports.PlanService = {
    createPlanIntoDb,
    getPlansFromDb,
    getSinglePlan,
    updatePlan,
    deletePlan,
};
