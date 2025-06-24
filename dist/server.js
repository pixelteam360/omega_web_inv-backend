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
const config_1 = __importDefault(require("./config"));
const app_1 = __importDefault(require("./app"));
const node_cron_1 = __importDefault(require("node-cron"));
const workoutPlans_service_1 = require("./app/modules/WorkoutPlans/workoutPlans.service");
const mealPlans_service_1 = require("./app/modules/MealPlans/mealPlans.service");
const WebSocket_1 = require("./app/modules/WebSocket");
let server;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        server = app_1.default.listen(config_1.default.port, () => {
            console.log("Server is listiening on port ", config_1.default.port);
        });
        (0, WebSocket_1.setupWebSocket)(server);
    });
}
node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, workoutPlans_service_1.deletWorkoutPlans)();
    yield (0, mealPlans_service_1.deletMealPlans)();
}));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield startServer();
        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.info("Server closed!");
                    restartServer();
                });
            }
            else {
                process.exit(1);
            }
        };
        const restartServer = () => {
            console.info("Restarting server...");
            main();
        };
        process.on("uncaughtException", (error) => {
            console.log("Uncaught Exception: ", error);
            exitHandler();
        });
        process.on("unhandledRejection", (error) => {
            console.log("Unhandled Rejection: ", error);
            exitHandler();
        });
        // Handling the server shutdown with SIGTERM and SIGINT
        process.on("SIGTERM", () => {
            console.log("SIGTERM signal received. Shutting down gracefully...");
            exitHandler();
        });
        process.on("SIGINT", () => {
            console.log("SIGINT signal received. Shutting down gracefully...");
            exitHandler();
        });
    });
}
main();
