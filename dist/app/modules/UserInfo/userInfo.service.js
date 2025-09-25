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
exports.UserInfoService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const createUserInfoIntoDb = (payload, userId, imageFile) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.userInfo.findFirst({
        where: { userId },
    });
    if (userInfo) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You have already submitted you info");
    }
    let image = "";
    if (imageFile) {
        image = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(imageFile)).Location;
    }
    const res = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield prisma.userInfo.create({
            data: Object.assign(Object.assign({}, payload), { userId, image }),
        });
        yield prisma.user.update({
            where: { id: userId },
            data: { profileCompleted: true },
        });
        return result;
    }));
    return res;
});
const getMyUserInfo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.userInfo.findFirst({
        where: { userId: id },
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User info not available");
    }
    return result;
});
const updateUserInfo = (payload, imageFile, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.userInfo.findFirst({
        where: { userId },
    });
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        let image = userInfo === null || userInfo === void 0 ? void 0 : userInfo.image;
        if (imageFile) {
            image = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(imageFile)).Location;
        }
        const updateUserInfoProfile = yield prisma.userInfo.update({
            where: { id: userInfo === null || userInfo === void 0 ? void 0 : userInfo.id },
            data: Object.assign(Object.assign({}, payload), { image: image }),
        });
        return updateUserInfoProfile;
    }));
    return result;
});
exports.UserInfoService = {
    createUserInfoIntoDb,
    getMyUserInfo,
    updateUserInfo,
};
