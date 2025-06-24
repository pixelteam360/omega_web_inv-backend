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
exports.sendNotificationToAll = void 0;
const firebase_1 = __importDefault(require("../../../shared/firebase"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const sendNotificationToAll = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: { id: payload.userId, fcmToken: { not: "" } },
        select: { fcmToken: true },
    });
    if (!user)
        return;
    const message = {
        notification: { title: payload.title, body: payload.body },
        token: user === null || user === void 0 ? void 0 : user.fcmToken,
    };
    yield prisma_1.default.notification.create({
        data: payload,
    });
    yield firebase_1.default.messaging().send(message);
    return {
        message: "Notification send successfully",
    };
});
exports.sendNotificationToAll = sendNotificationToAll;
