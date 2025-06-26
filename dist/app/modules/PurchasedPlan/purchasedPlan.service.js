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
exports.PurchasedPlanService = exports.checkPlans = exports.createPurchasedPlanIntoDb = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const createPurchasedPlanIntoDb = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: { id: userId },
        select: { id: true },
    });
    if (!user) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "User not found");
    }
    const Plan = yield prisma_1.default.plan.findFirst({
        where: { id: payload.planId },
        select: { id: true, duration: true, price: true },
    });
    if (!Plan) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Plan not found");
    }
    const havePlan = yield prisma_1.default.purchasedPlan.findFirst({
        where: { userId },
        select: { id: true, activePlan: true },
    });
    if (havePlan === null || havePlan === void 0 ? void 0 : havePlan.activePlan) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You already have a active Plan");
    }
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + Plan.duration * 24 * 60 * 60 * 1000);
    const amount = Plan.price;
    if (havePlan) {
        const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const updatePlan = yield prisma.purchasedPlan.update({
                where: { id: havePlan.id, userId },
                data: {
                    activePlan: true,
                    startDate: startDate,
                    amount,
                    planId: payload.planId,
                    endDate,
                },
            });
            yield prisma.user.update({
                where: { id: user.id },
                data: { activePlan: true },
            });
            return updatePlan;
        }));
        return result;
    }
    else {
        const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const createPlan = yield prisma.purchasedPlan.create({
                data: Object.assign(Object.assign({}, payload), { userId: user.id, activePlan: true, endDate,
                    amount, paymentId: payload.paymentId || "" }),
            });
            yield prisma.user.update({
                where: { id: user.id },
                data: { activePlan: true },
            });
            return createPlan;
        }));
        return result;
    }
});
exports.createPurchasedPlanIntoDb = createPurchasedPlanIntoDb;
const getPurchasedPlansFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.purchasedPlan.findMany({});
    return result;
});
const getSinglePurchasedPlan = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.purchasedPlan.findUnique({
        where: { id },
    });
    return result;
});
const getMyPurchasedPlan = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.purchasedPlan.findFirst({
        where: { userId, activePlan: true },
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User have no subsceiption");
    }
    return result;
});
const checkPlans = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const expiredPlans = yield prisma_1.default.purchasedPlan.findMany({
        where: { endDate: { lt: today }, activePlan: true },
        select: { id: true, userId: true },
    });
    const expiredUserIds = expiredPlans.map((sub) => sub.userId);
    if (expiredUserIds.length === 0)
        return;
    yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const updatePlan = yield prisma.purchasedPlan.updateMany({
            where: { userId: { in: expiredUserIds } },
            data: { activePlan: false },
        });
        const updateUser = yield prisma.user.updateMany({
            where: { id: { in: expiredUserIds }, activePlan: true },
            data: { activePlan: false },
        });
        return {
            updatePlan,
            updateUser,
        };
    }));
});
exports.checkPlans = checkPlans;
exports.PurchasedPlanService = {
    createPurchasedPlanIntoDb: exports.createPurchasedPlanIntoDb,
    getPurchasedPlansFromDb,
    getSinglePurchasedPlan,
    getMyPurchasedPlan,
};
