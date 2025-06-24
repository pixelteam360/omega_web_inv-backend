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
exports.messageToTrainer = messageToTrainer;
const prisma_1 = __importDefault(require("../../../../shared/prisma"));
const userSockets = new Map();
function messageToTrainer(ws, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { message, images } = data;
        const nutritionist = yield prisma_1.default.user.findFirst({
            where: { role: "ADMIN" },
            select: { id: true },
        });
        const receiverId = nutritionist === null || nutritionist === void 0 ? void 0 : nutritionist.id;
        const receiver = yield prisma_1.default.user.findFirst({
            where: { id: receiverId },
            select: { id: true, role: true },
        });
        if (!receiver) {
            console.log("Receiver not found");
            return;
        }
        if (!ws.userId || !receiverId || !message) {
            console.log("Invalid message payload");
            return;
        }
        let room = yield prisma_1.default.room.findFirst({
            where: {
                roomType: "TRAINER",
                OR: [
                    { senderId: ws.userId, receiverId },
                    { senderId: receiverId, receiverId: ws.userId },
                ],
            },
        });
        if (!room) {
            room = yield prisma_1.default.room.create({
                data: { senderId: ws.userId, receiverId, roomType: "TRAINER" },
            });
        }
        const chat = yield prisma_1.default.chat.create({
            data: {
                senderId: ws.userId,
                receiverId,
                roomId: room.id,
                message,
                images: images || "",
            },
        });
        const receiverSocket = userSockets.get(receiverId);
        if (receiverSocket) {
            receiverSocket.send(JSON.stringify({ event: "message", data: chat }));
        }
        ws.send(JSON.stringify({ event: "message", data: chat }));
    });
}
