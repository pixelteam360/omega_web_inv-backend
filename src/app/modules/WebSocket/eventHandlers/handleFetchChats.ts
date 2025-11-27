import prisma from "../../../../shared/prisma";
import { ExtendedWebSocket } from "../types";

const onlineUsers = new Set<string>();

export async function handleFetchChats(ws: ExtendedWebSocket, data: any) {
  const { receiverId, type } = data;
  if (!ws.userId) {
    return;
  }

  const roomType = type ? type : "ALL";

  const nutritionist = await prisma.user.findFirst({
    where: { role: "NUTRITION", email: "nutritionist@gmail.com" },
    select: { id: true },
  });

  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN", email: "homerd@alphapulsefit.com" },
    select: { id: true, role: true },
  });

  const myId =
    roomType === "NUTRITION" && admin?.role === "ADMIN"
      ? nutritionist?.id
      : ws.userId;

  const room = await prisma.room.findFirst({
    where: {
      roomType,
      OR: [
        { senderId: myId, receiverId },
        { senderId: receiverId, receiverId: myId },
      ],
    },
  });

  if (!room) {
    ws.send(JSON.stringify({ event: "fetchChats", data: [] }));
    return;
  }

  const chats = await prisma.chat.findMany({
    where: { roomId: room.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      message: true,
      images: true,
      createdAt: true,
      updatedAt: true,
      receiverId: true,
      senderId: true,
      isRead: true,
      receiver: { select: { userInfo: { select: { image: true } } } },
      sender: { select: { userInfo: { select: { image: true } } } },
    },
  });

  await prisma.chat.updateMany({
    where: { roomId: room.id, receiverId: ws.userId },
    data: { isRead: true },
  });

  ws.send(
    JSON.stringify({
      event: "fetchChats",
      data: chats,
      onlineUsers: onlineUsers.has(receiverId),
    })
  );
}
