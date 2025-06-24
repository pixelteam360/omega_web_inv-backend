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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnection = handleConnection;
const adminMessageList_1 = require("./eventHandlers/adminMessageList");
const authenticate_1 = require("./eventHandlers/authenticate");
const handleFetchChats_1 = require("./eventHandlers/handleFetchChats");
const handleMessage_1 = require("./eventHandlers/handleMessage");
const handleMessageList_1 = require("./eventHandlers/handleMessageList");
const handleUnReadMessages_1 = require("./eventHandlers/handleUnReadMessages");
const messageToNutritionist_1 = require("./eventHandlers/messageToNutritionist");
const messageToTrainer_1 = require("./eventHandlers/messageToTrainer");
function handleConnection(ws, wss) {
    ws.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
        try {
            const parsed = JSON.parse(data);
            const { event } = parsed;
            switch (event) {
                case "authenticate":
                    yield (0, authenticate_1.handleAuthenticate)(ws, parsed, wss);
                    break;
                case "message":
                    yield (0, handleMessage_1.handleMessage)(ws, parsed);
                    break;
                case "fetchChats":
                    yield (0, handleFetchChats_1.handleFetchChats)(ws, parsed);
                    break;
                case "unReadMessages":
                    yield (0, handleUnReadMessages_1.handleUnReadMessages)(ws, parsed);
                    break;
                case "messageList":
                    yield (0, handleMessageList_1.handleMessageList)(ws);
                    break;
                case "messageToNutritionist":
                    yield (0, messageToNutritionist_1.messageToNutritionist)(ws, parsed);
                    break;
                case "messageToTrainer":
                    yield (0, messageToTrainer_1.messageToTrainer)(ws, parsed);
                    break;
                case "adminMessageList":
                    yield (0, adminMessageList_1.adminMessageList)(ws, parsed);
                    break;
                default:
                    console.warn("Unknown event:", event);
            }
        }
        catch (err) {
            console.error("WebSocket message error:", err);
        }
    }));
    ws.on("close", () => {
        if (ws.userId) {
            // update shared state
        }
    });
}
