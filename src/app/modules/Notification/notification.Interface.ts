import { MessageType } from "@prisma/client";

export type Tnotification = {
  title: string;
  body: string;
  type: MessageType;
};

export type INotificationRequest = {
  title?: string | undefined;
  type?: string | undefined;
  searchTerm?: string | undefined;
};
