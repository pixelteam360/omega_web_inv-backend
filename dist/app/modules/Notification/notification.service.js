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
exports.NotificationService = exports.sendNotification = void 0;
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const firebase_1 = __importDefault(require("../../../shared/firebase"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const user_costant_1 = require("./user.costant");
const sendNotification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let users = [];
    if (payload.type === "ALL") {
        users = yield prisma_1.default.user.findMany({
            select: { fcmToken: true },
        });
    }
    else if (payload.type === "PAID") {
        users = yield prisma_1.default.user.findMany({
            where: { activePlan: true },
            select: { fcmToken: true },
        });
    }
    else if (payload.type === "UNPAID") {
        users = yield prisma_1.default.user.findMany({
            where: { activePlan: false },
            select: { fcmToken: true },
        });
    }
    if (users.length < 1)
        return;
    yield prisma_1.default.notification.create({
        data: payload,
    });
    const notificationPromises = users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user.fcmToken)
            return;
        const message = {
            notification: { title: payload.title, body: payload.body },
            token: user === null || user === void 0 ? void 0 : user.fcmToken,
        };
        yield firebase_1.default.messaging().send(message);
    }));
    yield Promise.all(notificationPromises);
    return {
        message: "Notification send successfully",
    };
});
exports.sendNotification = sendNotification;
const getAllNotification = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: user_costant_1.notificationSearchAbleFields.map((field) => ({
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
    const result = yield prisma_1.default.notification.findMany({
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
    });
    const total = yield prisma_1.default.notification.count({
        where: whereConditons,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.NotificationService = {
    sendNotification: exports.sendNotification,
    getAllNotification,
};
