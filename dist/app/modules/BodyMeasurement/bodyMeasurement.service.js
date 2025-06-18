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
exports.BodyMeasurementService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const createBodyMeasurementIntoDb = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const measurement = yield prisma_1.default.bodyMeasurement.findFirst({
        where: { userId },
    });
    if (measurement) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You have already created Body Measurement");
    }
    const { weight } = payload, rest = __rest(payload, ["weight"]);
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield prisma.bodyMeasurement.create({
            data: Object.assign(Object.assign({}, rest), { userId }),
        });
        yield prisma.weightProgress.create({
            data: { weight, userId },
        });
        return result;
    }));
    return result;
});
const getBodyMeasurementsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bodyMeasurement.findMany();
    return {
        data: result,
    };
});
const getSingleBodyMeasurement = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bodyMeasurement.findFirst({
        where: { id },
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Data not found");
    }
    return result;
});
const updateBodyMeasurement = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const measurement = yield prisma_1.default.bodyMeasurement.findFirst({
        where: { userId },
    });
    if (!measurement) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User Body Measurement not found");
    }
    const { weight, unit } = payload, rest = __rest(payload, ["weight", "unit"]);
    const lastWeight = yield prisma_1.default.weightProgress.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    const currentDate = new Date();
    const isSameDay = (lastWeight === null || lastWeight === void 0 ? void 0 : lastWeight.createdAt) &&
        lastWeight.createdAt.toDateString() === currentDate.toDateString();
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const bodyMeasurement = yield prisma.bodyMeasurement.update({
            where: { id: measurement.id },
            data: Object.assign({}, rest),
        });
        if (weight && !isSameDay) {
            yield prisma.weightProgress.create({
                data: { weight, userId },
            });
        }
        else if (weight && isSameDay) {
            yield prisma.weightProgress.update({
                where: { id: lastWeight === null || lastWeight === void 0 ? void 0 : lastWeight.id },
                data: { weight },
            });
        }
        return bodyMeasurement;
    }));
    return result;
});
exports.BodyMeasurementService = {
    createBodyMeasurementIntoDb,
    getBodyMeasurementsFromDb,
    getSingleBodyMeasurement,
    updateBodyMeasurement,
};
