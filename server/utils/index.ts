import {v4 as uuidv4} from "uuid";
import {userSocketRoomPrefix} from "../constants/index.js";
import {io} from "../index.js";
import {findRefById, getDocsAll} from "../models/firebase.js";
import {chatsCollection, usersCollection} from "../config/index.js";
import {Chat, Message} from "../types/chat.js";
import {UserData} from "../types/user.js";
import {collection} from "firebase/firestore";

export function uuid(options?: any) {
    return uuidv4(options);
}

export function isOnline(id: string): boolean {
    return !!io.sockets.adapter.rooms.get(userSocketRoomPrefix + id)?.size;
}

export async function getChatById(chatId: string): Promise<Chat> {
    const chatRef = await findRefById(chatsCollection, "id", chatId);
    const messagesCollection = collection(chatRef.ref, "messages");
    const messages: Message[] = await getDocsAll(messagesCollection);
    return {
        ...chatRef.data(),
        messages
    } as Chat;
}

export async function getUserById(uid: string) {
    const users: UserData[] = await getDocsAll(usersCollection);
    return users.find((user) => user.uid === uid);
}

export async function verifyChatMember(chatId: string, userId: string) {
    const chatRow = await getChatById(chatId);

    return chatRow.opponentId === userId || chatRow.creatorId === userId;
}
