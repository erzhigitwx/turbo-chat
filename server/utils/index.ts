import { v4 as uuidv4 } from "uuid";
import { userSocketRoomPrefix } from "../constants/index.ts";
import { io } from "../index.ts";
import { findRefById } from "../models/firebase.ts";
import { chatsCollection } from "../config/index.ts";
import { Chat } from "../types/chat.ts";

export function uuid(options?: any) {
  return uuidv4(options);
}

export function isOnline(id: string): boolean {
  return !!io.sockets.adapter.rooms.get(userSocketRoomPrefix + id)?.size;
}

export async function getChatById(chatId: string): Promise<Chat> {
  const chatRef = await findRefById(chatsCollection, "id", chatId);
  return chatRef.data() as Chat;
}

export async function verifyChatMember(chatId: string, userId: string) {
  const chatRow = await getChatById(chatId);

  return chatRow.opponentId === userId || chatRow.creatorId === userId;
}
