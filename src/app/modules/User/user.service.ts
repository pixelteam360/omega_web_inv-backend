import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import * as bcrypt from "bcrypt";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma } from "@prisma/client";
import { userSearchAbleFields } from "./user.costant";
import config from "../../../config";
import { IUserFilterRequest, TUser } from "./user.interface";

const createUserIntoDb = async (payload: TUser) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    if (existingUser.email === payload.email) {
      throw new ApiError(
        400,
        `User with this email ${payload.email} already exists`
      );
    }
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await prisma.user.create({
    data: { ...payload, password: hashedPassword, dailyGoal: { create: {} } },
    select: {
      id: true,
      email: true,
      phone: true,
      birth: true,
    },
  });

  return result;
};

const getUsersFromDb = async (
  params: IUserFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
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
  const whereConditons: Prisma.UserWhereInput = { AND: andCondions };

  const result = await prisma.user.findMany({
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
    select: {
      id: true,
      email: true,
      birth: true,
      phone: true,
      activePlan: true,
    },
  });
  const total = await prisma.user.count({
    where: whereConditons,
  });

  if (!result || result.length === 0) {
    throw new ApiError(404, "No active users found");
  }
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getMyProfile = async (userEmail: string) => {
  const userProfile = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
    select: {
      id: true,
      email: true,
      birth: true,
      phone: true,
      activePlan: true,
      userInfo: true,
      weightProgress: true,
      dailyGoal: true,
      bodyMeasurement: true,
    },
  });

  const [totalWorkout, completedWorkout, totalMeals, completedMeals] =
    await Promise.all([
      prisma.workoutPlans.count({
        where: { userId: userProfile?.id },
      }),

      prisma.workoutPlans.count({
        where: { userId: userProfile?.id, isCompleted: true },
      }),

      prisma.mealPlans.count({
        where: { userId: userProfile?.id },
      }),

      prisma.mealPlans.count({
        where: { userId: userProfile?.id, isCompleted: true },
      }),
    ]);

  const totalPlans = totalWorkout + totalMeals;
  const completedPlans = completedWorkout + completedMeals;

  const updatedDailyGoal = userProfile?.dailyGoal?.length
    ? {
        totalPlans,
        completedPlans,
        CaloriesBurned: userProfile?.dailyGoal[0].CaloriesBurned,
        CaloriesConsumed: userProfile?.dailyGoal[0].CaloriesConsumed,
      }
    : {};

  return { ...userProfile, dailyGoal: updatedDailyGoal };
};

const updateProfile = async (payload: TUser, userId: string) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: { phone: payload.phone, birth: payload.birth },
  });
  return result;
};

export const userService = {
  createUserIntoDb,
  getUsersFromDb,
  getMyProfile,
  updateProfile,
};
