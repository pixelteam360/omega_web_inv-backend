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
exports.WorkoutService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const fileUploader_1 = require("../../../helpars/fileUploader");
const http_status_1 = __importDefault(require("http-status"));
const workout_costant_1 = require("./workout.costant");
const createWorkoutIntoDb = (payload, thumbnailFile, iconFile, videoFile) => __awaiter(void 0, void 0, void 0, function* () {
    const fitnessGoal = yield prisma_1.default.fitnessGoal.findFirst({
        where: { title: payload.fitnessGoal },
    });
    if (!fitnessGoal) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Fitness Goal not found");
    }
    if (!videoFile || videoFile.length < 1) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Video file not found");
    }
    let icon = "";
    if (iconFile) {
        icon = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(iconFile)).Location;
    }
    let thumbnail = "";
    if (thumbnailFile) {
        thumbnail = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(thumbnailFile))
            .Location;
    }
    const video = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(videoFile)).Location;
    const result = yield prisma_1.default.workout.create({
        data: Object.assign(Object.assign({}, payload), { icon, video, thumbnail }),
    });
    return result;
});
const getWorkoutsFromDb = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: workout_costant_1.workoutSearchAbleFields.map((field) => ({
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
    const result = yield prisma_1.default.workout.findMany({
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
    const total = yield prisma_1.default.workout.count({
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
const getSingleWorkout = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.workout.findFirst({
        where: { id },
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Data not found");
    }
    return result;
});
const updateWorkout = (payload, id, thumbnailFile, iconFile, videoFile) => __awaiter(void 0, void 0, void 0, function* () {
    const workout = yield prisma_1.default.workout.findFirst({
        where: { id },
    });
    if (!workout) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Fitness Goal not found");
    }
    let icon = workout.icon;
    if (iconFile) {
        icon = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(iconFile)).Location;
    }
    let thumbnail = workout.thumbnail;
    if (thumbnailFile) {
        thumbnail = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(thumbnailFile))
            .Location;
    }
    let video = workout.video;
    if (videoFile) {
        video = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(videoFile)).Location;
    }
    const result = yield prisma_1.default.workout.update({
        where: { id },
        data: Object.assign(Object.assign({}, payload), { video, thumbnail, icon }),
    });
    return result;
});
const deleteWorkout = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.workout.delete({
        where: { id },
    });
    return { message: "Workout deleted successfully" };
});
exports.WorkoutService = {
    createWorkoutIntoDb,
    getWorkoutsFromDb,
    getSingleWorkout,
    updateWorkout,
    deleteWorkout,
};
