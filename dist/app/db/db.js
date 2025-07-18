"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.initiateSubscriptionPlan = exports.initiateSuperAdmin = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const initiateSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt.hash("123456789", Number(config_1.default.bcrypt_salt_rounds));
    const payload = {
        email: "admin@gmail.com",
        phone: "123456789",
        birth: "2000-06-09T12:00:00Z",
        activePlan: true,
        password: hashedPassword,
        role: client_1.UserRole.ADMIN,
    };
    const isExistUser = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (isExistUser)
        return;
    yield prisma_1.default.user.create({
        data: payload,
    });
});
exports.initiateSuperAdmin = initiateSuperAdmin;
const initiateSubscriptionPlan = () => __awaiter(void 0, void 0, void 0, function* () {
    const isExistPlan = yield prisma_1.default.plan.findMany();
    if (isExistPlan.length > 0)
        return;
    const defaultPlan = [
        {
            title: "Monthly Plan",
            duration: 30,
            price: 12.99,
            type: client_1.PlanType.MONTHLY,
            features: [
                "Unlimited access to all workouts and meal plans",
                "Messaging and full community interaction",
                "A 25% discount on vitamins and supplements at Alphaomegavitality.com",
            ],
        },
        {
            title: "Yearly Plan",
            duration: 365,
            price: 89.99,
            type: client_1.PlanType.YEARLY,
            features: [
                "Offering over 40% savings",
                "Unlimited access to all workouts and meal plans",
                "Messaging and full community interaction",
                "A 25% discount on vitamins and supplements at Alphaomegavitality.com",
            ],
        },
    ];
    yield prisma_1.default.plan.createMany({
        data: defaultPlan,
    });
});
exports.initiateSubscriptionPlan = initiateSubscriptionPlan;
