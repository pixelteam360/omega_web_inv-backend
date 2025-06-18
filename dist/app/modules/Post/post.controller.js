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
exports.PostController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const post_service_1 = require("./post.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const post_costant_1 = require("./post.costant");
const createPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { images, video } = req.files;
    const imageFiles = Array.isArray(images) && images.length > 0 ? images : undefined;
    const videoFiles = Array.isArray(video) && video.length > 0 ? video[0] : undefined;
    const result = yield post_service_1.PostService.createPostIntoDb(req.body, req.user.id, imageFiles, videoFiles);
    (0, sendResponse_1.default)(res, {
        message: "Post Registered successfully!",
        data: result,
    });
}));
const getPosts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, post_costant_1.postFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield post_service_1.PostService.getPostsFromDb(filters, options);
    (0, sendResponse_1.default)(res, {
        message: "Posts retrieve successfully!",
        data: result,
    });
}));
const getSinglePost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.PostService.getSinglePost(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Post profile retrieved successfully",
        data: result,
    });
}));
const giveLikeToPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.PostService.giveLikeToPost(req.params.id, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Post Liked successfully!",
        data: result,
    });
}));
const myLikedPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.PostService.myLikedPost(req.params.id, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Post like retrieved successfully",
        data: result,
    });
}));
const commentAPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.PostService.commentAPost(req.body, req.params.id, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Post commented successfully",
        data: result,
    });
}));
exports.PostController = {
    createPost,
    getPosts,
    getSinglePost,
    giveLikeToPost,
    myLikedPost,
    commentAPost,
};
