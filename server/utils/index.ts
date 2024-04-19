import { v4 as uuidv4 } from "uuid";
import { userSocketRoomPrefix } from "../constants";
import { io } from "../index";
import { findRefById } from "../models/firebase";
import { chatsCollection } from "../config";
import { Chat } from "../types/Chat";

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
