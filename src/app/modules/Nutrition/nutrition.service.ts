import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";
import { INutritionFilterRequest, TNutrition } from "./nutrition.interface";
import httpStatus from "http-status";
import { nutritionSearchAbleFields } from "./nutrition.costant";

const createNutritionIntoDb = async (
  payload: TNutrition,
  iconFile: any,
  imageFile: any
) => {
  const fitnessGoal = await prisma.fitnessGoal.findFirst({
    where: { title: payload.fitnessGoal },
  });

  if (!fitnessGoal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fitness Goal not found");
  }

  if (!imageFile || imageFile.length < 1) {
    throw new ApiError(httpStatus.NOT_FOUND, "iamge file not found");
  }

  let icon = "";
  if (iconFile) {
    icon = (await fileUploader.uploadToDigitalOcean(iconFile)).Location;
  }

  const images = await Promise.all(
    imageFile.map(async (image: any) => {
      const videoUrl = (await fileUploader.uploadToDigitalOcean(image))
        .Location;

      return videoUrl;
    })
  );

  const result = await prisma.nutrition.create({
    data: { ...payload, icon, images },
  });

  return result;
};

const getNutritionsFromDb = async (
  params: INutritionFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.NutritionWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: nutritionSearchAbleFields.map((field) => ({
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
  const whereConditons: Prisma.NutritionWhereInput = { AND: andCondions };

  const result = await prisma.nutrition.findMany({
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
  const total = await prisma.nutrition.count({
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

const getSingleNutrition = async (id: string) => {
  const result = await prisma.nutrition.findFirst({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  }
  return result;
};

const updateNutrition = async (
  payload: Partial<TNutrition>,
  id: string,
  iconFile: any,
  imageFile: any
) => {
  const Nutrition = await prisma.nutrition.findFirst({
    where: { id },
  });

  if (!Nutrition) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fitness Goal not found");
  }

  let icon = Nutrition.icon;
  if (iconFile) {
    icon = (await fileUploader.uploadToDigitalOcean(iconFile)).Location;
  }

  let imageUrls: string[] = [];
  if (Array.isArray(imageFile) && imageFile.length > 0) {
    imageUrls = await Promise.all(
      imageFile.map(async (image: any) => {
        const uploaded = await fileUploader.uploadToDigitalOcean(image);
        return uploaded.Location;
      })
    );
  }

  const images = [...(Nutrition.images ?? []), ...imageUrls];

  const result = await prisma.nutrition.update({
    where: { id },
    data: { ...payload, images, icon },
  });

  return result;
};

 const deleteNutrition = async (id: string) => {
  await prisma.nutrition.delete({
    where: { id },
  });

  return { message: "Nutrition deleted successfully" };
};

export const NutritionService = {
  createNutritionIntoDb,
  getNutritionsFromDb,
  getSingleNutrition,
  updateNutrition,
  deleteNutrition,
};
