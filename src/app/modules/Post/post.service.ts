import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, Post } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";
import {
  IPostFilterRequest,
  IReportFilterRequest,
  TPost,
} from "./post.interface";
import { postSearchAbleFields, reportSearchAbleFields } from "./post.costant";
import httpStatus from "http-status";

const createPostIntoDb = async (
  payload: TPost,
  userId: string,
  imageFile: any,
  videoFile: any
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      activePlan: true,
    },
  });

  if (user?.activePlan === false) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to create posts. Please activate your plan."
    );
  }

  let video = "";
  if (videoFile) {
    video = (await fileUploader.uploadToDigitalOcean(videoFile)).Location;
  }

  const images = await Promise.all(
    imageFile.map(async (image: any) => {
      const imageUrl = (await fileUploader.uploadToDigitalOcean(image))
        .Location;

      return imageUrl;
    })
  );

  const result = await prisma.post.create({
    data: { ...payload, images, video, userId },
  });

  return result;
};

const getPostsFromDb = async (
  params: IPostFilterRequest,
  options: IPaginationOptions,
  userId: string
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.PostWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: postSearchAbleFields.map((field) => ({
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
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditons: Prisma.PostWhereInput = { AND: andCondions };

  const blockList = await prisma.blokeList.findMany({
    where: { blockerId: userId },
  });

  const blockedUser = blockList.map((item) => item.blockedId);

  const result = await prisma.post.findMany({
    where: {
      ...whereConditons,
      isDeleted: false,
      userId: { notIn: blockedUser },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
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
      createdAt: true,
      user: {
        select: {
          id: true,
          userInfo: {
            select: { image: true, fullName: true },
          },
        },
      },
      _count: true,
    },
  });
  const total = await prisma.post.count({
    where: {
      ...whereConditons,
      isDeleted: false,
      userId: { notIn: blockedUser },
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getMyPosts = async (userId: string) => {
  const posts = await prisma.post.findMany({
    where: { userId, isDeleted: false },
    select: {
      id: true,
      description: true,
      images: true,
      video: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          userInfo: {
            select: { image: true, fullName: true },
          },
        },
      },
      _count: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return posts;
};

const getSinglePost = async (id: string) => {
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      postComment: {
        select: {
          id: true,
          comment: true,
          createdAt: true,
          userId: true,
          postId: true,
          user: {
            select: { userInfo: { select: { image: true, fullName: true } } },
          },
        },
      },
    },
  });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  const reshapedPost = {
    id: post.id,
    postComment: post.postComment.map((comment) => ({
      id: comment.id,
      comment: comment.comment,
      image: comment.user?.userInfo?.image ?? null,
      fullName: comment.user?.userInfo?.fullName ?? null,
      createdAt: comment.createdAt,
      userId: comment.userId,
      postId: comment.postId,
    })),
  };

  return reshapedPost;
};

const giveLikeToPost = async (postId: string, userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      activePlan: true,
    },
  });

  if (user?.activePlan === false) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to like the posts. Please activate your plan."
    );
  }

  const post = await prisma.post.findFirst({
    where: { id: postId },
  });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  const isLiked = await prisma.postLike.findFirst({
    where: { postId: post.id, userId },
  });

  if (isLiked) {
    await prisma.postLike.delete({
      where: { id: isLiked.id },
    });

    return { message: "Post Like deleted" };
  } else {
    const result = await prisma.postLike.create({
      data: { postId, userId },
    });
    return result;
  }
};

const myLikedPost = async (postId: string, userId: string) => {
  const result = await prisma.postLike.findFirst({
    where: { postId, userId },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "You didn't like this post yet");
  }

  return result;
};

const commentAPost = async (
  payload: { comment: string },
  postId: string,
  userId: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      activePlan: true,
    },
  });

  if (user?.activePlan === false) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to comment the posts. Please activate your plan."
    );
  }

  const post = await prisma.post.findFirst({
    where: { id: postId },
  });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  const result = await prisma.postComment.create({
    data: { ...payload, postId, userId },
  });

  return result;
};

const deletePost = async (postId: string, userId: string) => {
  const post = await prisma.post.findFirst({
    where: { id: postId, userId },
  });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Your post not found");
  }

  const res = await prisma.$transaction(async (prisma) => {
    await prisma.postComment.deleteMany({
      where: { postId },
    });

    await prisma.postLike.deleteMany({
      where: { postId },
    });

    await prisma.post.delete({
      where: { id: postId },
    });
  });

  return { message: "Post deleted successfully" };
};

const reportPost = async (
  payload: {
    message: string;
    postId: string;
  },
  userId: string
) => {
  const post = await prisma.post.findUnique({
    where: { id: payload.postId },
  });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "post not found");
  }

  const res = await prisma.reportPost.create({
    data: { ...payload, userId },
  });

  return res;
};

const allReports = async (
  params: IReportFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.ReportPostWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: reportSearchAbleFields.map((field) => ({
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
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditons: Prisma.ReportPostWhereInput = { AND: andCondions };

  const result = await prisma.reportPost.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    include: {
      user: {
        select: {
          email: true,
          userInfo: { select: { fullName: true, image: true } },
        },
      },
      post: { include: { user: { select: { email: true } } } },
    },
  });
  const total = await prisma.reportPost.count({
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
};

export const PostService = {
  createPostIntoDb,
  getPostsFromDb,
  getSinglePost,
  deletePost,
  giveLikeToPost,
  myLikedPost,
  commentAPost,
  getMyPosts,
  reportPost,
  allReports,
};
