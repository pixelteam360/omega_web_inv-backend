import admin from "../../../shared/firebase";
import prisma from "../../../shared/prisma";
import { Tnotification } from "./notification.Interface";

export const sendNotification = async (payload: Tnotification) => {
  let users: { fcmToken: string | null }[] = [];

  if (payload.type === "ALL") {
    users = await prisma.user.findMany({
      where: { fcmToken: { not: "" } },
      select: { fcmToken: true },
    });
  } else if (payload.type === "PAID") {
    users = await prisma.user.findMany({
      where: { activePlan: true, fcmToken: { not: "" } },
      select: { fcmToken: true },
    });
  } else if (payload.type === "UNPAID") {
    users = await prisma.user.findMany({
      where: { activePlan: false, fcmToken: { not: "" } },
      select: { fcmToken: true },
    });
  }

  if (users.length < 1) return;

  await prisma.notification.create({
    data: payload,
  });

  const notificationPromises = users.map(async (user) => {
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

export const NotificationService = {
  sendNotification,
};
