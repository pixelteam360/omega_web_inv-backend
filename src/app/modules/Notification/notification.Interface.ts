import { MessageType } from "@prisma/client";

export type Tnotification = {
  title: string;
  body: string
  type: MessageType
};
