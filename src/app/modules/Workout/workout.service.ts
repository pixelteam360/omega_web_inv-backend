import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";
import { IWorkoutFilterRequest, TWorkout } from "./workout.interface";
import httpStatus from "http-status";
import { workoutSearchAbleFields } from "./workout.costant";

const createWorkoutIntoDb = async (
  payload: TWorkout,
  thumbnailFile: any,
  iconFile: any,
  videoFile: any
) => {
  const fitnessGoal = await prisma.fitnessGoal.findFirst({
    where: { title: payload.fitnessGoal },
  });

  if (!fitnessGoal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fitness Goal not found");
  }

  if (!videoFile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Video file not found");
  }

  let icon = "";
  if (iconFile) {
    icon = (await fileUploader.uploadToDigitalOcean(iconFile)).Location;
  }

  let thumbnail = "";
  if (thumbnailFile) {
    thumbnail = (await fileUploader.uploadToDigitalOcean(thumbnailFile))
      .Location;
  }

  const videos = await Promise.all(
    videoFile.map(async (video: any) => {
      const videoUrl = (await fileUploader.uploadToDigitalOcean(video))
        .Location;

      return videoUrl;
    })
  );

  const result = await prisma.workout.create({
    data: { ...payload, icon, videos, thumbnail },
  });

  return result;
};

const getWorkoutsFromDb = async (
  params: IWorkoutFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.WorkoutWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: workoutSearchAbleFields.map((field) => ({
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
  const whereConditons: Prisma.WorkoutWhereInput = { AND: andCondions };

  const result = await prisma.workout.findMany({
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
  });
  const total = await prisma.workout.count({
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

const getSingleWorkout = async (id: string) => {
  const result = await prisma.workout.findFirst({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  }
  return result;
};

const updateWorkout = async (
  payload: Partial<TWorkout>,
  id: string,
  thumbnailFile: any,
  iconFile: any,
  videoFile: any
) => {
  const workout = await prisma.workout.findFirst({
    where: { id },
  });

  if (!workout) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fitness Goal not found");
  }

  let icon = workout.icon;
  if (iconFile) {
    icon = (await fileUploader.uploadToDigitalOcean(iconFile)).Location;
  }

  let thumbnail = workout.thumbnail;
  if (thumbnailFile) {
    thumbnail = (await fileUploader.uploadToDigitalOcean(thumbnailFile))
      .Location;
  }

  let videoUrl: string[] = [];
  if (Array.isArray(videoFile) && videoFile.length > 0) {
    videoUrl = await Promise.all(
      videoFile.map(async (video: any) => {
        const uploaded = await fileUploader.uploadToDigitalOcean(video);
        return uploaded.Location;
      })
    );
  }

  const videos = [...(workout.videos ?? []), ...videoUrl];

  const result = await prisma.workout.update({
    where: { id },
    data: { ...payload, videos, thumbnail, icon },
  });

  return result;
};

const deleteWorkout = async (id: string) => {
  await prisma.workout.delete({
    where: { id },
  });

  return { message: "Workout deleted successfully" };
};

export const WorkoutService = {
  createWorkoutIntoDb,
  getWorkoutsFromDb,
  getSingleWorkout,
  updateWorkout,
  deleteWorkout
};
