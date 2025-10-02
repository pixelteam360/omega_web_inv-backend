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
import { createPurchasedPlanIntoDb } from "../PurchasedPlan/purchasedPlan.service";
import httpStatus from "http-status";

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
                Email verification OTP code is below.
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

  const plan = await prisma.plan.findFirst({
    where: { type: "MONTHLY" },
    select: { id: true },
  });

  const refferral = await prisma.user.findFirst({
    where: { id: payload.refferralCode },
    select: { id: true },
  });

  const { refferralCode, ...restData } = payload;

  await prisma.$transaction(async (prisma) => {
    const userData = await prisma.user.create({
      data: {
        ...restData,
        password: hashedPassword,
        dailyGoal: { create: {} },
      },
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

    if (payload.refferralCode && plan && refferral) {
      await createPurchasedPlanIntoDb(
        { planId: plan.id, paymentId: "defaultPlanId" },
        refferral.id
      );
    }
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
      activePlan: true,
      email: true,
      isDeleted: true,
      userInfo: { select: { fullName: true, image: true } },
    },
  });
  const total = await prisma.user.count({
    where: whereConditons,
  });
  const paid = await prisma.user.count({
    where: { ...whereConditons, activePlan: true },
  });
  const unPaid = await prisma.user.count({
    where: { ...whereConditons, activePlan: false },
  });

  if (!result || result.length === 0) {
    throw new ApiError(404, "No active users found");
  }
  return {
    meta: {
      page,
      limit,
      total,
      paid,
      unPaid,
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
      dailyGoal: true,
      bodyMeasurement: true,
      varifiedEmail: true,
      profileCompleted: true,
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

  const result = await prisma.weightProgress.findMany({
    where: { userId: userProfile?.id },
  });

  const startWeight = result.length ? result[0].weight : 0;

  const endWeight = result.length > 1 ? result[result.length - 1].weight : 0;

  return {
    ...userProfile,
    dailyGoal: updatedDailyGoal,
    startWeight,
    endWeight,
  };
};

const updateProfile = async (payload: TUser, userId: string) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: { phone: payload.phone, birth: payload.birth },
  });
  return result;
};

const myWeightProgress = async (userId: string) => {
  const result = await prisma.weightProgress.findMany({
    where: { userId },
  });

  return result;
};

const blockUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, isDeleted: true },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isDeleted: !user.isDeleted },
  });

  return { message: "User status updated successfully" };
};

const deleteUserWithRelations = async (userId: string) => {
  // Find the user first
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await prisma.$transaction(async (prisma) => {
    // Delete UserInfo
    await prisma.userInfo.deleteMany({ where: { userId } });

    // Delete BodyMeasurements
    await prisma.bodyMeasurement.deleteMany({ where: { userId } });

    // Delete WeightProgress
    await prisma.weightProgress.deleteMany({ where: { userId } });

    // Delete WorkoutPlans
    await prisma.workoutPlans.deleteMany({ where: { userId } });

    // Delete MealPlans
    await prisma.mealPlans.deleteMany({ where: { userId } });

    // Delete DailyGoal
    await prisma.dailyGoal.deleteMany({ where: { userId } });

    // Delete Posts and related likes/comments
    const posts = await prisma.post.findMany({ where: { userId } });
    for (const post of posts) {
      await prisma.postLike.deleteMany({ where: { postId: post.id } });
      await prisma.postComment.deleteMany({ where: { postId: post.id } });
    }
    await prisma.post.deleteMany({ where: { userId } });

    // Delete PurchasedPlans
    await prisma.purchasedPlan.deleteMany({ where: { userId } });

    // Delete Rooms where user is sender or receiver
    const rooms = await prisma.room.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });

    for (const room of rooms) {
      // Delete chats in the room
      await prisma.chat.deleteMany({ where: { roomId: room.id } });
    }
    // Delete the rooms
    await prisma.room.deleteMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });

    // Finally, delete the User
    await prisma.user.delete({ where: { id: userId } });

    return { message: "User and all related data deleted successfully" };
  });

  return result;
};

export const userService = {
  createUserIntoDb,
  getUsersFromDb,
  getMyProfile,
  updateProfile,
  myWeightProgress,
  blockUser,
  deleteUserWithRelations,
};
