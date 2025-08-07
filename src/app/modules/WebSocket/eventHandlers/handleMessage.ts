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
    console.log("Receiver not found");
    return;
  }

  if (!ws.userId || !receiverId || !message) {
    console.log("Invalid message payload");
    return;
  }

  const roomType = "ALL";

  let room = await prisma.room.findFirst({
    where: {
      roomType: type ? type : roomType,
      OR: [
        { senderId: ws.userId, receiverId },
        { senderId: receiverId, receiverId: ws.userId },
      ],
    },
  });

  if (!room) {
    room = await prisma.room.create({
      data: {
        senderId: ws.userId,
        receiverId,
        roomType: type ? type : roomType,
      },
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
