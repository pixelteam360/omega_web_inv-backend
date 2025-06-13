import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PostValidation } from "./post.validation";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
import { PostController } from "./post.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router
  .route("/")
  .get(PostController.getPosts)
  .post(
    auth(UserRole.USER, UserRole.ADMIN),
    fileUploader.post,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(PostValidation.PostValidationSchema),
    PostController.createPost
  );

router
  .route("/:id")
  .get(auth(UserRole.ADMIN, UserRole.USER), PostController.getSinglePost)
  .patch(auth(UserRole.ADMIN, UserRole.USER), PostController.giveLikeToPost);

router
  .route("/engagement/:id")
  .get(auth(UserRole.ADMIN, UserRole.USER), PostController.myLikedPost);

export const PostRoutes = router;
