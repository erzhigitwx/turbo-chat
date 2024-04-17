export type MessageType = "file" | "media" | "voice" | "text";

export interface Message {
  senderId: string;
  messageId: string;
  type: MessageType;
  reactions: Array<string>;
  deletedFor: Array<string>;
  createdAt: number;
  isForwarded: boolean;
  isChecked: boolean;
  reply: string; // message id
  content: any;
}

export interface Chat {
  id: string;
  creatorId: string;
  opponentId: string;
  messages: Message[];
  deletedFor: Array<string>;
  bio?: string;
  theme?: string;
}
