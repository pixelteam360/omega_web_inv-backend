import admin from "../../../shared/firebase";
import prisma from "../../../shared/prisma";
import { Tnotification } from "./notification.Interface";

export const sendNotificationToAll = async (payload: Tnotification) => {
  const users = await prisma.user.findMany({
    where: { fcmToken: { not: "" } },
    select: { fcmToken: true },
  });

  if (users.length < 1) return;

  await prisma.notification.create({
    data: { ...payload, type: "ALL" },
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

export const sendNotificationToPaidUser = async (payload: Tnotification) => {
  const users = await prisma.user.findMany({
    where: { activePlan: true, fcmToken: { not: "" } },
    select: { fcmToken: true },
  });

  if (users.length < 1) return;

  await prisma.notification.create({
    data: { ...payload, type: "PAID" },
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

export const sendNotificationToUnPaidUser = async (payload: Tnotification) => {
  const users = await prisma.user.findMany({
    where: { activePlan: false, fcmToken: { not: "" } },
    select: { fcmToken: true },
  });

  if (users.length < 1) return;

  await prisma.notification.create({
    data: { ...payload, type: "UNPAID" },
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
  sendNotificationToAll,
  sendNotificationToPaidUser,
  sendNotificationToUnPaidUser
};
