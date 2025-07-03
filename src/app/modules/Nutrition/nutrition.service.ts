import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";
import { INutritionFilterRequest, TNutrition } from "./nutrition.interface";
import httpStatus from "http-status";
import { nutritionSearchAbleFields } from "./nutrition.costant";
import axios from "axios";
import config from "../../../config";

const createNutritionIntoDb = async (payload: TNutrition, files: any) => {
  const iconFile = files.find((file: any) => file.fieldname === "icon");

  const nutritionFile = files.find(
    (file: any) => file.fieldname === "nutritionTips"
  );

  if (!nutritionFile) {
    throw new ApiError(httpStatus.NOT_FOUND, "nutrition file not found");
  }

  let icon = "";
  if (iconFile) {
    icon = (await fileUploader.uploadToDigitalOcean(iconFile)).Location;
  }

  let nutritionTips = "";
  if (nutritionFile) {
    nutritionTips = (await fileUploader.uploadToDigitalOcean(nutritionFile))
      .Location;
  }

  const itemsData = await Promise.all(
    payload.items.map(async (item, idx) => {
      const imageFile = files.find(
        (file: any) => file.fieldname === `items[${idx}][image]`
      );
      console.log("imageFile ===>", imageFile);
      const image = (await fileUploader.uploadToDigitalOcean(imageFile))
        .Location;
      return {
        ...item,
        image,
      };
    })
  );
  console.log(itemsData);
  const result = await prisma.$transaction(async (tx) => {
    const nutrition = await tx.nutrition.create({
      data: {
        title: payload.title,
        mealTime: payload.mealTime,
        fitnessGoal: payload.fitnessGoal || "",
        icon,
        nutritionTips,
      },
    });

    await tx.nutritionItem.createMany({
      data: itemsData.map((item) => ({
        ...item,
        nutritionId: nutrition.id,
      })),
    });

    return nutrition;
  });
  console.log(result);
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
    include: {
      nutritionItems: true,
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
    include: {
      nutritionItems: true,
    },
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
  nutritionTipsFile: any
) => {
  const existingNutrition = await prisma.nutrition.findUnique({
    where: { id },
  });

  if (!existingNutrition) {
    throw new ApiError(httpStatus.NOT_FOUND, "Nutrition not found");
  }

  let icon = existingNutrition.icon;
  if (iconFile) {
    icon = (await fileUploader.uploadToDigitalOcean(iconFile)).Location;
  }

  let nutritionTips = existingNutrition.nutritionTips;
  if (nutritionTipsFile) {
    nutritionTips = (await fileUploader.uploadToDigitalOcean(nutritionTipsFile))
      .Location;
  }

  const result = await prisma.nutrition.update({
    where: { id },
    data: {
      title: payload.title,
      mealTime: payload.mealTime,
      fitnessGoal: payload.fitnessGoal,
      icon,
      nutritionTips,
    },
  });

  return result;
};

const deleteNutrition = async (id: string) => {
  const existingNutrition = await prisma.nutrition.findUnique({
    where: { id },
  });

  if (!existingNutrition) {
    throw new ApiError(httpStatus.NOT_FOUND, "Nutrition not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.mealPlans.deleteMany({
      where: { nutritionId: id },
    });

    await tx.nutritionItem.deleteMany({
      where: { nutritionId: id },
    });

    await tx.nutrition.delete({
      where: { id },
    });

    return { message: "Nutrition deleted successfully" };
  });

  return result;
};

const edamamData = async () => {

  const items = [
    "rice",
    "chicken",
    "cheese",
    "egg",
    "bread",
    "beef",
    "milk",
    "pasta",
    "banana",
    "spinach",
  ];

  try {
    const res = await axios.get(
      "https://api.edamam.com/api/food-database/v2/parser",
      {
        params: {
          app_id: config.edamam.app_id,
          app_key: config.edamam.app_key,
          ingr: items.join(","),
        },
      }
    );

    // const food = res.data.hints.find(
    //   (item) => item.food.foodId === "food_a9al1uoaczd7p8bv3g9vebl5erqx"
    // );
    // if (!food) {
    //   throw new ApiError(httpStatus.NOT_FOUND, "Food not found");
    // }

    return res.data.hints;
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    throw new Error("Failed to fetch food data");
  }
};

export const NutritionService = {
  createNutritionIntoDb,
  getNutritionsFromDb,
  getSingleNutrition,
  edamamData,
  updateNutrition,
  deleteNutrition,
};
