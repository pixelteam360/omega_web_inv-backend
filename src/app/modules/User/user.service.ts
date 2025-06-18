import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import * as bcrypt from "bcrypt";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma } from "@prisma/client";
import { userSearchAbleFields } from "./user.costant";
import config from "../../../config";
import { IUserFilterRequest, TUser } from "./user.interface";
import crypto from "crypto";
import { emailSender } from "../../../shared/emailSender";

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

  const otp = Number(crypto.randomInt(1000, 9999));

  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 30px; background: linear-gradient(135deg, #6c63ff, #3f51b5); border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
            <h2 style="color: #ffffff; font-size: 28px; text-align: center; margin-bottom: 20px;">
                <span style="color: #ffeb3b;">Verity Email OTP</span>
            </h2>
            <p style="font-size: 16px; color: #333; line-height: 1.5; text-align: center;">
                Email varification OTP code is below.
            </p>
            <p style="font-size: 32px; font-weight: bold; color: #FB4958; text-align: center; margin: 20px 0;">
                ${otp}
            </p>
            <div style="text-align: center; margin-bottom: 20px;">
                <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
                    This OTP will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.
                </p>
                <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
                    If you need assistance, feel free to contact us.
                </p>
            </div>
            <div style="text-align: center; margin-top: 30px;">
                <p style="font-size: 12px; color: #999; text-align: center;">
                    Best Regards,<br/>
                    <span style="font-weight: bold; color: #3f51b5;">Alpha Pulse</span><br/>
                    <a href="mailto:support@nmbull.com" style="color: #ffffff; text-decoration: none; font-weight: bold;">Contact Support</a>
                </p>
            </div>
        </div>
    </div> `;

  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  await prisma.$transaction(async (prisma) => {
    const userData = await prisma.user.create({
      data: { ...payload, password: hashedPassword, dailyGoal: { create: {} } },
      select: {
        id: true,
        email: true,
        phone: true,
        birth: true,
      },
    });

    await emailSender(userData.email, html, "Verify you email");

    await prisma.user.update({
      where: { id: userData.id },
      data: {
        otp: otp,
        expirationOtp: otpExpires,
      },
    });
  });

  return { message: "OTP sent to your email successfully" };
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
      varifiedEmail: true,
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
