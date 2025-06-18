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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const bcrypt = __importStar(require("bcrypt"));
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const user_costant_1 = require("./user.costant");
const config_1 = __importDefault(require("../../../config"));
const crypto_1 = __importDefault(require("crypto"));
const emailSender_1 = require("../../../shared/emailSender");
const createUserIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findFirst({
        where: {
            email: payload.email,
        },
    });
    if (existingUser) {
        if (existingUser.email === payload.email) {
            throw new ApiErrors_1.default(400, `User with this email ${payload.email} already exists`);
        }
    }
    const otp = Number(crypto_1.default.randomInt(1000, 9999));
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const html = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 30px; background: linear-gradient(135deg, #6c63ff, #3f51b5); border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
            <h2 style="color: #ffffff; font-size: 28px; text-align: center; margin-bottom: 20px;">
                <span style="color: #ffeb3b;">Verity Email OTP</span>
            </h2>
            <p style="font-size: 16px; color: #333; line-height: 1.5; text-align: center;">
                Email varification OTP code is below.
            </p>
            <p style="font-size: 32px; font-weight: bold; color: #FB4958; text-align: center; margin: 20px 0;">
                ${otp}
            </p>
            <div style="text-align: center; margin-bottom: 20px;">
                <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
                    This OTP will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.
                </p>
                <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
                    If you need assistance, feel free to contact us.
                </p>
            </div>
            <div style="text-align: center; margin-top: 30px;">
                <p style="font-size: 12px; color: #999; text-align: center;">
                    Best Regards,<br/>
                    <span style="font-weight: bold; color: #3f51b5;">Alpha Pulse</span><br/>
                    <a href="mailto:support@nmbull.com" style="color: #ffffff; text-decoration: none; font-weight: bold;">Contact Support</a>
                </p>
            </div>
        </div>
    </div> `;
    const hashedPassword = yield bcrypt.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const userData = yield prisma.user.create({
            data: Object.assign(Object.assign({}, payload), { password: hashedPassword, dailyGoal: { create: {} } }),
            select: {
                id: true,
                email: true,
                phone: true,
                birth: true,
            },
        });
        yield (0, emailSender_1.emailSender)(userData.email, html, "Verify you email");
        yield prisma.user.update({
            where: { id: userData.id },
            data: {
                otp: otp,
                expirationOtp: otpExpires,
            },
        });
    }));
    return { message: "OTP sent to your email successfully" };
});
const getUsersFromDb = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: user_costant_1.userSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditons = { AND: andCondions };
    const result = yield prisma_1.default.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        select: {
            id: true,
            email: true,
            birth: true,
            phone: true,
            activePlan: true,
        },
    });
    const total = yield prisma_1.default.user.count({
        where: whereConditons,
    });
    if (!result || result.length === 0) {
        throw new ApiErrors_1.default(404, "No active users found");
    }
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getMyProfile = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userProfile = yield prisma_1.default.user.findUnique({
        where: {
            email: userEmail,
        },
        select: {
            id: true,
            email: true,
            birth: true,
            phone: true,
            activePlan: true,
            userInfo: true,
            weightProgress: true,
            dailyGoal: true,
            bodyMeasurement: true,
            varifiedEmail: true,
        },
    });
    const [totalWorkout, completedWorkout, totalMeals, completedMeals] = yield Promise.all([
        prisma_1.default.workoutPlans.count({
            where: { userId: userProfile === null || userProfile === void 0 ? void 0 : userProfile.id },
        }),
        prisma_1.default.workoutPlans.count({
            where: { userId: userProfile === null || userProfile === void 0 ? void 0 : userProfile.id, isCompleted: true },
        }),
        prisma_1.default.mealPlans.count({
            where: { userId: userProfile === null || userProfile === void 0 ? void 0 : userProfile.id },
        }),
        prisma_1.default.mealPlans.count({
            where: { userId: userProfile === null || userProfile === void 0 ? void 0 : userProfile.id, isCompleted: true },
        }),
    ]);
    const totalPlans = totalWorkout + totalMeals;
    const completedPlans = completedWorkout + completedMeals;
    const updatedDailyGoal = ((_a = userProfile === null || userProfile === void 0 ? void 0 : userProfile.dailyGoal) === null || _a === void 0 ? void 0 : _a.length)
        ? {
            totalPlans,
            completedPlans,
            CaloriesBurned: userProfile === null || userProfile === void 0 ? void 0 : userProfile.dailyGoal[0].CaloriesBurned,
            CaloriesConsumed: userProfile === null || userProfile === void 0 ? void 0 : userProfile.dailyGoal[0].CaloriesConsumed,
        }
        : {};
    return Object.assign(Object.assign({}, userProfile), { dailyGoal: updatedDailyGoal });
});
const updateProfile = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.update({
        where: { id: userId },
        data: { phone: payload.phone, birth: payload.birth },
    });
    return result;
});
exports.userService = {
    createUserIntoDb,
    getUsersFromDb,
    getMyProfile,
    updateProfile,
};
