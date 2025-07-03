"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const post_validation_1 = require("./post.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const post_controller_1 = require("./post.controller");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router
    .route("/")
    .get(post_controller_1.PostController.getPosts)
    .post((0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), fileUploader_1.fileUploader.post, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(post_validation_1.PostValidation.PostValidationSchema), post_controller_1.PostController.createPost);
router
    .route("/my")
    .get((0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), post_controller_1.PostController.getMyPosts);
router
    .route("/:id")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), post_controller_1.PostController.getSinglePost)
    .patch((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), post_controller_1.PostController.giveLikeToPost)
    .post((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), post_controller_1.PostController.commentAPost)
    .delete((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), post_controller_1.PostController.deletePost);
router
    .route("/engagement/:id")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), post_controller_1.PostController.myLikedPost);
exports.PostRoutes = router;
