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
exports.NutritionService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const http_status_1 = __importDefault(require("http-status"));
const nutrition_costant_1 = require("./nutrition.costant");
const createNutritionIntoDb = (payload, iconFile, imageFile) => __awaiter(void 0, void 0, void 0, function* () {
    // const fitnessGoal = await prisma.fitnessGoal.findFirst({
    //   where: { title: payload.fitnessGoal },
    // });
    // if (!fitnessGoal) {
    //   throw new ApiError(httpStatus.NOT_FOUND, "Fitness Goal not found");
    // }
    // if (!imageFile || imageFile.length < 1) {
    //   throw new ApiError(httpStatus.NOT_FOUND, "iamge file not found");
    // }
    // let icon = "";
    // if (iconFile) {
    //   icon = (await fileUploader.uploadToDigitalOcean(iconFile)).Location;
    // }
    // const images = await Promise.all(
    //   imageFile.map(async (image: any) => {
    //     const videoUrl = (await fileUploader.uploadToDigitalOcean(image))
    //       .Location;
    //     return videoUrl;
    //   })
    // );
    // const result = await prisma.nutrition.create({
    //   data: { ...payload, icon, images },
    // });
    // return result;
});
const getNutritionsFromDb = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: nutrition_costant_1.nutritionSearchAbleFields.map((field) => ({
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
    const result = yield prisma_1.default.nutrition.findMany({
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
    const total = yield prisma_1.default.nutrition.count({
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
const getSingleNutrition = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.nutrition.findFirst({
        where: { id },
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Data not found");
    }
    return result;
});
const updateNutrition = (payload, id, iconFile, imageFile) => __awaiter(void 0, void 0, void 0, function* () {
    // const Nutrition = await prisma.nutrition.findFirst({
    //   where: { id },
    // });
    // if (!Nutrition) {
    //   throw new ApiError(httpStatus.NOT_FOUND, "Fitness Goal not found");
    // }
    // let icon = Nutrition.icon;
    // if (iconFile) {
    //   icon = (await fileUploader.uploadToDigitalOcean(iconFile)).Location;
    // }
    // let imageUrls: string[] = [];
    // if (Array.isArray(imageFile) && imageFile.length > 0) {
    //   imageUrls = await Promise.all(
    //     imageFile.map(async (image: any) => {
    //       const uploaded = await fileUploader.uploadToDigitalOcean(image);
    //       return uploaded.Location;
    //     })
    //   );
    // }
    // const images = [...(Nutrition.images ?? []), ...imageUrls];
    // const result = await prisma.nutrition.update({
    //   where: { id },
    //   data: { ...payload, images, icon },
    // });
    // return result;
});
const deleteNutrition = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.nutrition.delete({
        where: { id },
    });
    return { message: "Nutrition deleted successfully" };
});
exports.NutritionService = {
    createNutritionIntoDb,
    getNutritionsFromDb,
    getSingleNutrition,
    updateNutrition,
    deleteNutrition,
};
