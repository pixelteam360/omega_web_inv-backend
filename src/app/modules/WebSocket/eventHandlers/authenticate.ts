import config from "../../../../config";
import { jwtHelpers } from "../../../../helpars/jwtHelpers";
import prisma from "../../../../shared/prisma";
import { ExtendedWebSocket } from "../types";
import { broadcastToAll } from "../utils";
import { WebSocketServer } from "ws";

const onlineUsers = new Set<string>();
export const userSockets = new Map<string, ExtendedWebSocket>();

export async function handleAuthenticate(
  ws: ExtendedWebSocket,
  data: any,
  wss: WebSocketServer
) {
  const token = data.token;

  if (!token) return ws.close();

  const user = jwtHelpers.verifyToken(token, config.jwt.jwt_secret!);
  if (!user) return ws.close();

  const userData = await prisma.user.findFirst({ where: { id: user.id } });
  if (!userData) return ws.close();

  ws.userId = user.id;
  onlineUsers.add(user.id);
  userSockets.set(user.id, ws);

  broadcastToAll(wss, {
    event: "userStatus",
    data: { userId: user.id, isOnline: true },
  });
}
