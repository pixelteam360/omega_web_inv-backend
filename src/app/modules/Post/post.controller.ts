import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PostService } from "./post.service";
import pick from "../../../shared/pick";
import { postFilterableFields } from "./post.costant";

const createPost = catchAsync(async (req, res) => {
  const { images, video } = req.files as any;

  const imageFiles =
    Array.isArray(images) && images.length > 0 ? images : undefined;
  const videoFiles =
    Array.isArray(video) && video.length > 0 ? video[0] : undefined;

  const result = await PostService.createPostIntoDb(
    req.body,
    req.user.id,
    imageFiles,
    videoFiles
  );
  sendResponse(res, {
    message: "Post Registered successfully!",
    data: result,
  });
});

const getPosts = catchAsync(async (req, res) => {
  const filters = pick(req.query, postFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await PostService.getPostsFromDb(filters, options);
  sendResponse(res, {
    message: "Posts retrieve successfully!",
    data: result,
  });
});

const getMyPosts = catchAsync(async (req, res) => {
  const result = await PostService.getMyPosts(req.user.id);
  sendResponse(res, {
    message: "Post retrieved successfully",
    data: result,
  });
});

const getSinglePost = catchAsync(async (req, res) => {
  const result = await PostService.getSinglePost(req.params.id);
  sendResponse(res, {
    message: "Post retrieved successfully",
    data: result,
  });
});

const giveLikeToPost = catchAsync(async (req, res) => {
  const result = await PostService.giveLikeToPost(req.params.id, req.user.id);
  sendResponse(res, {
    message: "Post Liked successfully!",
    data: result,
  });
});

const myLikedPost = catchAsync(async (req, res) => {
  const result = await PostService.myLikedPost(req.params.id, req.user.id);
  sendResponse(res, {
    message: "Post like retrieved successfully",
    data: result,
  });
});

const commentAPost = catchAsync(async (req, res) => {
  const result = await PostService.commentAPost(
    req.body,
    req.params.id,
    req.user.id
  );
  sendResponse(res, {
    message: "Post commented successfully",
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const result = await PostService.deletePost(req.params.id, req.user.id);
  sendResponse(res, {
    message: "Post deleted successfully",
    data: result,
  });
});

export const PostController = {
  createPost,
  getPosts,
  getSinglePost,
  giveLikeToPost,
  myLikedPost,
  commentAPost,
  getMyPosts,
  deletePost
};
