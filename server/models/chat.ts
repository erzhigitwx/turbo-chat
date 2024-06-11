import { findRefById } from "./firebase.js";
import { chatsCollection, storage } from "../config/index.js";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getChatById, uuid } from "../utils/index.js";
import { AttachType, Message } from "../types/chat.js";
import { UserData } from "../types/user.js";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function createTextMessage(
  userData: UserData,
  chatId: string,
  message: string,
  attach?: AttachType,
) {
  const chatRef = await findRefById(chatsCollection, "id", chatId);
  const messagesCollection = collection(chatRef.ref, "messages");
  const messageFormatted: Message = {
    senderId: userData.uid,
    createdAt: Date.now(),
    messageId: uuid(),
    content: message,
    clearedFor: [],
    status: "send",
    type: attach ? "media" : "text",
    ...(attach ? attach : null),
  };
  const newMessage = await addDoc(
    messagesCollection,
    messageFormatted as Message,
  );
  const chatRow = await getChatById(chatId);
  if (!chatRow) return;

  if (chatRow.deletedFor.length) {
    await updateDoc(chatRef.ref, { deletedFor: [] });
  }

  if (newMessage) {
    await updateDoc(chatRef.ref, { unread: chatRow.unread + 1 });
    return { success: true, data: newMessage };
  }
}

export async function createAttachMessage(
  userData: UserData,
  chatId: string,
  media: AttachType["data"],
) {
  if (!media || media.length === 0) {
    return { success: false, data: "Files are missing" };
  }

  const uploadPromises = media.map(async (file, index) => {
    if (!file || !(file instanceof Buffer)) {
      throw new Error(
        `File at index ${index} is missing or not a valid buffer`,
      );
    }

    const fileName = `file_${Date.now()}_${index}.png`;
    const mediaRef = ref(storage, `media/${chatId}/${fileName}`);
    await uploadBytes(mediaRef, file);
    const imageUrl = await getDownloadURL(mediaRef);
    return imageUrl;
  });

  try {
    const imageUrls = await Promise.all(uploadPromises);
    return { success: true, data: imageUrls };
  } catch (error) {
    return { success: false, data: "Internal server error" };
  }
}
