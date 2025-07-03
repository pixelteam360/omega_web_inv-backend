import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { IPaginationOptions } from "../../../interfaces/paginations";
import admin from "../../../shared/firebase";
import prisma from "../../../shared/prisma";
import { INotificationRequest, Tnotification } from "./notification.Interface";
import { notificationSearchAbleFields } from "./user.costant";

export const sendNotification = async (payload: Tnotification) => {
  let users: { fcmToken: string | null }[] = [];

  if (payload.type === "ALL") {
    users = await prisma.user.findMany({
      select: { fcmToken: true },
    });
  } else if (payload.type === "PAID") {
    users = await prisma.user.findMany({
      where: { activePlan: true },
      select: { fcmToken: true },
    });
  } else if (payload.type === "UNPAID") {
    users = await prisma.user.findMany({
      where: { activePlan: false },
      select: { fcmToken: true },
    });
  }

  if (users.length < 1) return;

  await prisma.notification.create({
    data: payload,
  });

  const notificationPromises = users.map(async (user) => {
    if (!user.fcmToken) return;
    const message = {
      notification: { title: payload.title, body: payload.body },
      token: user?.fcmToken!,
    };

    await admin.messaging().send(message);
  });

  await Promise.all(notificationPromises);

  return {
    message: "Notification send successfully",
  };
};

const getAllNotification = async (
  params: INotificationRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.NotificationWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: notificationSearchAbleFields.map((field) => ({
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
  const whereConditons: Prisma.NotificationWhereInput = { AND: andCondions };

  const result = await prisma.notification.findMany({
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
  const total = await prisma.notification.count({
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

export const NotificationService = {
  sendNotification,
  getAllNotification,
};
