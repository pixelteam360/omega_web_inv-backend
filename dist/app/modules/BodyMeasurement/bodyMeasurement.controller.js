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
exports.BodyMeasurementController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const bodyMeasurement_service_1 = require("./bodyMeasurement.service");
const createBodyMeasurement = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bodyMeasurement_service_1.BodyMeasurementService.createBodyMeasurementIntoDb(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "BodyMeasurement created successfully!",
        data: result,
    });
}));
const getBodyMeasurements = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bodyMeasurement_service_1.BodyMeasurementService.getBodyMeasurementsFromDb();
    (0, sendResponse_1.default)(res, {
        message: "BodyMeasurements retrieve successfully!",
        data: result,
    });
}));
const getSingleBodyMeasurement = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bodyMeasurement_service_1.BodyMeasurementService.getSingleBodyMeasurement(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "BodyMeasurement retrieved successfully",
        data: result,
    });
}));
const updateBodyMeasurement = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bodyMeasurement_service_1.BodyMeasurementService.updateBodyMeasurement(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "BodyMeasurement updated successfully!",
        data: result,
    });
}));
exports.BodyMeasurementController = {
    createBodyMeasurement,
    getBodyMeasurements,
    getSingleBodyMeasurement,
    updateBodyMeasurement,
};
