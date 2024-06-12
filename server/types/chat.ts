export type MessageType = "file" | "media" | "voice" | "text";

export interface Message {
  senderId: string;
  messageId: string;
  type: MessageType;
  clearedFor: Array<string>;
  createdAt: number;
  content: any;
  status: "send" | "check";
  reply?: string; // message id
  isForwarded?: boolean;
  reactions?: Array<string>;
  attach?: AttachType["data"];
}

export type AttachType = {
  type: "media" | "file";
  data: File[] | string[];
};

export interface Chat {
  id: string;
  creatorId: string;
  opponentId: string;
  unread: number;
  messages: Message[];
  deletedFor: Array<string>;
  isPinned: boolean;
  note?: string;
  theme?: string;
}
