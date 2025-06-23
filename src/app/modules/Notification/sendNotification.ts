import admin from "../../../shared/firebase";
import prisma from "../../../shared/prisma";
import { Tnotification } from "./notification.Interface";

export const sendNotificationToAll = async (payload: Tnotification) => {
  const user = await prisma.user.findFirst({
    where: { id: payload.userId, fcmToken: { not: "" } },
    select: { fcmToken: true },
  });

  if (!user) return;

  const message = {
    notification: { title: payload.title, body: payload.body },
    token: user?.fcmToken!,
  };

  await prisma.notification.create({
    data: payload,
  });

  await admin.messaging().send(message);

  return {
    message: "Notification send successfully",
  };
};
