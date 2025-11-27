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
<div style="font-family: Arial, sans-serif; background-color: #f5f7fa; padding: 30px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #e1e1e1;">
      
      <h2 style="color: #FB4958; font-size: 24px; text-align: center; margin-bottom: 20px; font-weight: bold;">
          Your Email Verification Code
      </h2>

      <p style="font-size: 16px; color: #444; line-height: 1.6; text-align: center;">
          To verify your email address, please use the one-time password (OTP) provided below.
      </p>

      <p style="font-size: 38px; font-weight: bold; color: #FB4958; text-align: center; margin: 30px 0; letter-spacing: 4px;">
          ${otp}
      </p>

      <div style="text-align: center; margin-bottom: 20px;">
          <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
              This verification code is valid for <strong>10 minutes</strong>.  
              For your security, please do not share this code with anyone.
          </p>
          <p style="font-size: 14px; color: #666;">
              If you did not request this code, you may safely ignore this email.
          </p>
      </div>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

      <div style="text-align: center; margin-top: 20px;">
          <p style="font-size: 12px; color: #777;">
              Kind Regards,<br/>
              <span style="font-weight: bold; color: #FB4958;">AlphaPulse Team</span><br/>
          </p>
      </div>

  </div>
</div>`;

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

    await emailSender(
      userData.email,
      html,
      "Your AlphaPulse Verification Code"
    );

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
    where: { ...whereConditons, role: { notIn: ["ADMIN", "NUTRITION"] } },
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
    where: { ...whereConditons, role: { notIn: ["ADMIN", "NUTRITION"] } },
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
  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ Delete related UserInfo
      await tx.userInfo.deleteMany({ where: { userId } });

      // 2️⃣ Delete related BodyMeasurements
      await tx.bodyMeasurement.deleteMany({ where: { userId } });

      // 3️⃣ Delete WeightProgress
      await tx.weightProgress.deleteMany({ where: { userId } });

      // 4️⃣ Delete DailyGoal
      await tx.dailyGoal.deleteMany({ where: { userId } });

      // 5️⃣ Delete WorkoutPlans
      await tx.workoutPlans.deleteMany({ where: { userId } });

      // 6️⃣ Delete MealPlans
      await tx.mealPlans.deleteMany({ where: { userId } });

      // 7️⃣ Delete Purchased Plans
      await tx.purchasedPlan.deleteMany({ where: { userId } });

      // 8️⃣ Handle Posts and related records
      const posts = await tx.post.findMany({ where: { userId } });
      for (const post of posts) {
        await tx.postLike.deleteMany({ where: { postId: post.id } });
        await tx.postComment.deleteMany({ where: { postId: post.id } });
        await tx.reportPost.deleteMany({ where: { postId: post.id } });
      }
      await tx.post.deleteMany({ where: { userId } });

      // 9️⃣ Delete user’s own PostLikes, PostComments, ReportPosts (as actor)
      await tx.postLike.deleteMany({ where: { userId } });
      await tx.postComment.deleteMany({ where: { userId } });
      await tx.reportPost.deleteMany({ where: { userId } });

      // 🔟 Delete chat rooms and messages
      const rooms = await tx.room.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      });

      for (const room of rooms) {
        await tx.chat.deleteMany({ where: { roomId: room.id } });
      }

      await tx.room.deleteMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      });

      // 1️⃣1️⃣ Delete messages sent/received by user (extra safety)
      await tx.chat.deleteMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      });

      // 1️⃣2️⃣ Finally, delete the User
      await tx.user.delete({
        where: { id: userId },
      });

      return { message: "User and all related data deleted successfully" };
    });

    return { success: true, ...result };
  } catch (err: any) {
    return {
      success: false,
      message: "An unexpected error occurred!",
      errorSources: [err.message],
      err,
    };
  }
};

const deleteUser = async (userId: string) => {
  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ Delete related UserInfo
      await tx.userInfo.deleteMany({ where: { userId } });

      // 2️⃣ Delete related BodyMeasurements
      await tx.bodyMeasurement.deleteMany({ where: { userId } });

      // 3️⃣ Delete WeightProgress
      await tx.weightProgress.deleteMany({ where: { userId } });

      // 4️⃣ Delete DailyGoal
      await tx.dailyGoal.deleteMany({ where: { userId } });

      // 5️⃣ Delete WorkoutPlans
      await tx.workoutPlans.deleteMany({ where: { userId } });

      // 6️⃣ Delete MealPlans
      await tx.mealPlans.deleteMany({ where: { userId } });

      // 7️⃣ Delete Purchased Plans
      await tx.purchasedPlan.deleteMany({ where: { userId } });

      await tx.blokeList.deleteMany({
        where: { OR: [{ blockedId: userId }, { blockerId: userId }] },
      });

      // 8️⃣ Handle Posts and related records
      const posts = await tx.post.findMany({ where: { userId } });
      for (const post of posts) {
        await tx.postLike.deleteMany({ where: { postId: post.id } });
        await tx.postComment.deleteMany({ where: { postId: post.id } });
        await tx.reportPost.deleteMany({ where: { postId: post.id } });
      }
      await tx.post.deleteMany({ where: { userId } });

      // 9️⃣ Delete user’s own PostLikes, PostComments, ReportPosts (as actor)
      await tx.postLike.deleteMany({ where: { userId } });
      await tx.postComment.deleteMany({ where: { userId } });
      await tx.reportPost.deleteMany({ where: { userId } });

      // 🔟 Delete chat rooms and messages
      const rooms = await tx.room.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      });

      for (const room of rooms) {
        await tx.chat.deleteMany({ where: { roomId: room.id } });
      }

      await tx.room.deleteMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      });

      // 1️⃣1️⃣ Delete messages sent/received by user (extra safety)
      await tx.chat.deleteMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      });

      // 1️⃣2️⃣ Finally, delete the User
      await tx.user.delete({
        where: { id: userId },
      });

      return { message: "User and all related data deleted successfully" };
    });

    return { success: true, ...result };
  } catch (err: any) {
    return {
      success: false,
      message: "An unexpected error occurred!",
      errorSources: [err.message],
      err,
    };
  }
};

const UserToUserBlock = async (myId: string, userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  await prisma.blokeList.create({
    data: { blockerId: myId, blockedId: userId },
  });

  return { message: "User blocked successfully" };
};

export const userService = {
  createUserIntoDb,
  getUsersFromDb,
  getMyProfile,
  updateProfile,
  myWeightProgress,
  blockUser,
  deleteUserWithRelations,
  deleteUser,
  UserToUserBlock,
};
