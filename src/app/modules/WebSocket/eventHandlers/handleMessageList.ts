import prisma from "../../../../shared/prisma";
import { ExtendedWebSocket } from "../types";

const onlineUsers = new Set<string>();

export async function handleMessageList(ws: ExtendedWebSocket) {
  try {
    const rooms = await prisma.room.findMany({
      where: {
        AND: [
          {
            OR: [{ senderId: ws.userId }, { receiverId: ws.userId }],
          },
          {
            roomType: {
              notIn: ["NUTRITION", "TRAINER"],
            },
          },
        ],
      },
      include: {
        chat: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    const userIds = rooms.map((room) => {
      return room.senderId === ws.userId ? room.receiverId : room.senderId;
    });

    const userInfos = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        userInfo: { select: { fullName: true, image: true } },
      },
    });

    const userWithLastMessages = rooms.map((room) => {
      const otherprofileId =
        room.senderId === ws.userId ? room.receiverId : room.senderId;

      const userInfo = userInfos.find(
        (userInfo) => userInfo.id === otherprofileId
      );

      return {
        user: userInfo || null,
        lastMessage: room.chat[0] || null,
        onlineUsers: onlineUsers.has(userInfo?.id as string),
      };
    });
  
    ws.send(
      JSON.stringify({
        event: "messageList",
        data: userWithLastMessages,
      })
    );
  } catch (error) {
    console.error("Error fetching user list with last messages:", error);
    ws.send(
      JSON.stringify({
        event: "error",
        message: "Failed to fetch users with last messages",
      })
    );
  }
}
