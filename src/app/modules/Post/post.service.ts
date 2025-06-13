import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, Post } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";
import { IPostFilterRequest, TPost } from "./post.interface";
import { postSearchAbleFields } from "./post.costant";
import httpStatus from "http-status";

const createPostIntoDb = async (
  payload: TPost,
  userId: string,
  imageFile: any,
  videoFile: any
) => {
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
  options: IPaginationOptions
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

  const result = await prisma.post.findMany({
    where: { ...whereConditons, isDeleted: false },
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
      userId: true,
      _count: true,
    },
  });
  const total = await prisma.post.count({
    where: { ...whereConditons, isDeleted: false },
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

const getSinglePost = async (id: string) => {
  const PostProfile = await prisma.post.findUnique({
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
};

const giveLikeToPost = async (postId: string, userId: string) => {
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

export const PostService = {
  createPostIntoDb,
  getPostsFromDb,
  getSinglePost,
  giveLikeToPost,
  myLikedPost,
  commentAPost,
};
