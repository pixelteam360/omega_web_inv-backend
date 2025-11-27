import prisma from "../../../../shared/prisma";
import { ExtendedWebSocket } from "../types";
import { userSockets } from "./authenticate";

export async function messageToNutritionist(ws: ExtendedWebSocket, data: any) {
  const { message, images } = data;

  const nutritionist = await prisma.user.findUnique({
    where: { role: "NUTRITION", email: "nutritionist@gmail.com" },
    select: { id: true },
  });

  const receiverId = nutritionist?.id;

  const receiver = await prisma.user.findFirst({
    where: { id: receiverId },
    select: { id: true, role: true },
  });

  if (!receiver) {
    return;
  }

  if (!ws.userId || !receiverId || !message) {
    console.log("Invalid message payload");
    return;
  }

  let room = await prisma.room.findFirst({
    where: {
      roomType: "NUTRITION",
      OR: [
        { senderId: ws.userId, receiverId },
        { senderId: receiverId, receiverId: ws.userId },
      ],
    },
  });

  if (!room) {
    room = await prisma.room.create({
      data: { senderId: ws.userId, receiverId, roomType: "NUTRITION" },
    });
  }

  const chat = await prisma.chat.create({
    data: {
      senderId: ws.userId,
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
