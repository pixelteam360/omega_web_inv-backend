import prisma from "../../../../shared/prisma";
import { ExtendedWebSocket } from "../types";
import { userSockets } from "./authenticate";

export async function handleMessage(ws: ExtendedWebSocket, data: any) {
  const { receiverId, message, images, type } = data;

  const receiver = await prisma.user.findFirst({
    where: { id: receiverId },
    select: { id: true, role: true },
  });

  if (!receiver) {
    return;
  }

  if (!ws.userId || !receiverId || !message) {
    return;
  }

  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN", email: "homerd@alphapulsefit.com" },
    select: { id: true },
  });

  const nutrition = await prisma.user.findFirst({
    where: { role: "NUTRITION", email: "nutritionist@gmail.com" },
    select: { id: true },
  });

  const senderId =
    data.type === "TRAINER"
      ? admin?.id
      : data.type === "NUTRITION"
      ? nutrition?.id
      : ws.userId;

  const roomType = "ALL";

  let room = await prisma.room.findFirst({
    where: {
      roomType: type ? type : roomType,
      OR: [
        { senderId: senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
  });

  if (!room) {
    room = await prisma.room.create({
      data: {
        senderId: senderId!,
        receiverId,
        roomType: type ? type : roomType,
      },
    });
  }

  const chat = await prisma.chat.create({
    data: {
      senderId: senderId!,
      receiverId,
      roomId: room.id,
      message,
      images: images || "",
    },
  });

  const receiverSocket = userSockets.get(receiverId);
  if (receiverSocket) {
    receiverSocket.send(JSON.stringify({ event: "message", data: chat }));
  }
  ws.send(JSON.stringify({ event: "message", data: chat }));
}
