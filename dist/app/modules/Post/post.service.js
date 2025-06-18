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
exports.PostService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const fileUploader_1 = require("../../../helpars/fileUploader");
const post_costant_1 = require("./post.costant");
const http_status_1 = __importDefault(require("http-status"));
const createPostIntoDb = (payload, userId, imageFile, videoFile) => __awaiter(void 0, void 0, void 0, function* () {
    let video = "";
    if (videoFile) {
        video = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(videoFile)).Location;
    }
    const images = yield Promise.all(imageFile.map((image) => __awaiter(void 0, void 0, void 0, function* () {
        const imageUrl = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(image))
            .Location;
        return imageUrl;
    })));
    const result = yield prisma_1.default.post.create({
        data: Object.assign(Object.assign({}, payload), { images, video, userId }),
    });
    return result;
});
const getPostsFromDb = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: post_costant_1.postSearchAbleFields.map((field) => ({
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
    const result = yield prisma_1.default.post.findMany({
        where: Object.assign(Object.assign({}, whereConditons), { isDeleted: false }),
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        select: {
            id: true,
            description: true,
            images: true,
            video: true,
            userId: true,
            _count: true,
        },
    });
    const total = yield prisma_1.default.post.count({
        where: Object.assign(Object.assign({}, whereConditons), { isDeleted: false }),
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
const getSinglePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const PostProfile = yield prisma_1.default.post.findUnique({
        where: { id },
        select: {
            id: true,
            description: true,
            images: true,
            video: true,
            postComment: true,
            postLike: true,
        },
    });
    return PostProfile;
});
const giveLikeToPost = (postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield prisma_1.default.post.findFirst({
        where: { id: postId },
    });
    if (!post) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    const isLiked = yield prisma_1.default.postLike.findFirst({
        where: { postId: post.id, userId },
    });
    if (isLiked) {
        yield prisma_1.default.postLike.delete({
            where: { id: isLiked.id },
        });
        return { message: "Post Like deleted" };
    }
    else {
        const result = yield prisma_1.default.postLike.create({
            data: { postId, userId },
        });
        return result;
    }
});
const myLikedPost = (postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.postLike.findFirst({
        where: { postId, userId },
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "You didn't like this post yet");
    }
    return result;
});
const commentAPost = (payload, postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield prisma_1.default.post.findFirst({
        where: { id: postId },
    });
    if (!post) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    const result = yield prisma_1.default.postComment.create({
        data: Object.assign(Object.assign({}, payload), { postId, userId }),
    });
    return result;
});
exports.PostService = {
    createPostIntoDb,
    getPostsFromDb,
    getSinglePost,
    giveLikeToPost,
    myLikedPost,
    commentAPost,
};
