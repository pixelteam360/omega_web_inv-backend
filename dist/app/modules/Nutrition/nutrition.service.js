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
const fileUploader_1 = require("../../../helpars/fileUploader");
const http_status_1 = __importDefault(require("http-status"));
const nutrition_costant_1 = require("./nutrition.costant");
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../../config"));
const createNutritionIntoDb = (payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    const iconFile = files.find((file) => file.fieldname === "icon");
    const nutritionFile = files.find((file) => file.fieldname === "nutritionTips");
    if (!nutritionFile) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "nutrition file not found");
    }
    let icon = "";
    if (iconFile) {
        icon = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(iconFile)).Location;
    }
    let nutritionTips = "";
    if (nutritionFile) {
        nutritionTips = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(nutritionFile))
            .Location;
    }
    const itemsData = yield Promise.all(payload.items.map((item, idx) => __awaiter(void 0, void 0, void 0, function* () {
        const imageFile = files.find((file) => file.fieldname === `items[${idx}][image]`);
        console.log("imageFile ===>", imageFile);
        const image = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(imageFile))
            .Location;
        return Object.assign(Object.assign({}, item), { image });
    })));
    console.log(itemsData);
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const nutrition = yield tx.nutrition.create({
            data: {
                title: payload.title,
                mealTime: payload.mealTime,
                fitnessGoal: payload.fitnessGoal || "",
                icon,
                nutritionTips,
            },
        });
        yield tx.nutritionItem.createMany({
            data: itemsData.map((item) => (Object.assign(Object.assign({}, item), { nutritionId: nutrition.id }))),
        });
        return nutrition;
    }));
    console.log(result);
    return result;
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
        include: {
            nutritionItems: true,
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
        include: {
            nutritionItems: true,
        },
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Data not found");
    }
    return result;
});
const updateNutrition = (payload, id, iconFile, nutritionTipsFile) => __awaiter(void 0, void 0, void 0, function* () {
    const existingNutrition = yield prisma_1.default.nutrition.findUnique({
        where: { id },
    });
    if (!existingNutrition) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Nutrition not found");
    }
    let icon = existingNutrition.icon;
    if (iconFile) {
        icon = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(iconFile)).Location;
    }
    let nutritionTips = existingNutrition.nutritionTips;
    if (nutritionTipsFile) {
        nutritionTips = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(nutritionTipsFile))
            .Location;
    }
    const result = yield prisma_1.default.nutrition.update({
        where: { id },
        data: {
            title: payload.title,
            mealTime: payload.mealTime,
            fitnessGoal: payload.fitnessGoal,
            icon,
            nutritionTips,
        },
    });
    return result;
});
const deleteNutrition = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingNutrition = yield prisma_1.default.nutrition.findUnique({
        where: { id },
    });
    if (!existingNutrition) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Nutrition not found");
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.mealPlans.deleteMany({
            where: { nutritionId: id },
        });
        yield tx.nutritionItem.deleteMany({
            where: { nutritionId: id },
        });
        yield tx.nutrition.delete({
            where: { id },
        });
        return { message: "Nutrition deleted successfully" };
    }));
    return result;
});
const edamamData = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const items = [
        "rice",
        "chicken",
        "cheese",
        "egg",
        "bread",
        "beef",
        "milk",
        "pasta",
        "banana",
        "spinach",
    ];
    try {
        const res = yield axios_1.default.get("https://api.edamam.com/api/food-database/v2/parser", {
            params: {
                app_id: config_1.default.edamam.app_id,
                app_key: config_1.default.edamam.app_key,
                ingr: items.join(","),
            },
        });
        // const food = res.data.hints.find(
        //   (item) => item.food.foodId === "food_a9al1uoaczd7p8bv3g9vebl5erqx"
        // );
        // if (!food) {
        //   throw new ApiError(httpStatus.NOT_FOUND, "Food not found");
        // }
        return res.data.hints;
    }
    catch (error) {
        console.error(((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw new Error("Failed to fetch food data");
    }
});
exports.NutritionService = {
    createNutritionIntoDb,
    getNutritionsFromDb,
    getSingleNutrition,
    edamamData,
    updateNutrition,
    deleteNutrition,
};
