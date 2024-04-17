import { Request, Response } from "express";
import { addToCollection, findRefById, getDocsAll } from "../models/firebase";
import { chatsCollection, usersCollection } from "../config";
import { UserData } from "../types/user";
import { uuid } from "../utils";
import { Chat, Message } from "../types/Chat";
import { getDoc, doc, collection, addDoc } from "firebase/firestore";

class ChatsController {
  async createChat(req: Request, res: Response) {
    const body = req.body;
    const { opponentId, userData } = body;
    const chats = await getDocsAll(chatsCollection);
    const hasChat = chats.some((chat) => {
      if (
        (chat.opponentId === opponentId || chat.opponentId === userData.uid) &&
        (chat.creatorId === opponentId || chat.creatorId === userData.uid)
      ) {
        return true;
      }
      return false;
    });

    if (hasChat) {
      // corresponding logic
    }

    try {
      const createdChat = await addToCollection(chatsCollection, {
        id: uuid(),
        opponentId,
        creatorId: userData.uid,
        messages: [],
        deletedFor: [],
      } as Chat);

      if (createdChat.success) {
        const newChatRef = doc(chatsCollection, createdChat.data.id);
        const newChatSnapshot = await getDoc(newChatRef);
        if (newChatSnapshot.exists()) {
          return res
            .status(200)
            .send({ success: true, data: newChatSnapshot.data() });
        } else {
          return res
            .status(404)
            .send({ success: false, data: "Chat not found" });
        }
      } else {
        return res
          .status(400)
          .send({ success: false, data: "Cannot Create Chat" });
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      return res
        .status(500)
        .send({ success: false, data: "Internal Server Error" });
    }
  }

  async getChats(req: Request, res: Response) {
    const body = req.body;
    const { userData } = body;

    const chats = await getDocsAll(chatsCollection);

    const filteredChats = await Promise.all(
      chats.map(async (chat) => {
        if (
          chat.creatorId === userData.uid ||
          chat.opponentId === userData.uid
        ) {
          const chatRef = await findRefById(chatsCollection, chat.id);
          const messagesCollection = collection(chatRef.ref, "messages");
          chat.messages = await getDocsAll(messagesCollection);
          return chat;
        }
        return null;
      }),
    );

    const userChats = filteredChats.filter((chat) => chat !== null);

    if (filteredChats) {
      return res.status(200).send({ success: true, data: userChats });
    } else {
      return res.status(400).send({ success: false, data: "Cannot Get Chats" });
    }
  }

  async searchUsers(req: Request, res: Response) {
    try {
      const body = req.body;
      const { query, userData } = body;
      const users: UserData[] = await getDocsAll(usersCollection);
      const chats: Chat[] = await getDocsAll(chatsCollection);

      const searchResults = !!query
        ? users.filter((user) =>
            user.login.toLowerCase().startsWith(query.toLowerCase()),
          )
        : [];

      const existingUsersInChats = chats.reduce((acc, chat) => {
        if (
          (chat.opponentId === userData.uid ||
            chat.creatorId === userData.uid) &&
          searchResults.some(
            (user) =>
              user.uid === chat.opponentId || user.uid === chat.creatorId,
          )
        ) {
          const userToRemove = searchResults.find(
            (user) =>
              user.uid === chat.opponentId || user.uid === chat.creatorId,
          );
          if (userToRemove) {
            acc.push(userToRemove);
          }
        }
        return acc;
      }, []);

      const existingChats = chats.filter((chat) => {
        return (
          (chat.opponentId === userData.uid ||
            chat.creatorId === userData.uid) &&
          existingUsersInChats.some(
            (user) =>
              user.uid === chat.opponentId || user.uid === chat.creatorId,
          )
        );
      });

      return res.status(200).send({
        success: true,
        data: {
          existingChats,
          searchResults: searchResults.filter(
            (user) => !existingUsersInChats.includes(user),
          ),
        },
      });
    } catch (error) {
      console.error("Error searching users:", error);
      return res
        .status(500)
        .send({ success: false, data: "Internal Server Error" });
    }
  }

  async createMessage(req: Request, res: Response) {
    const body = req.body;
    const { userData, id, content } = body;
    const chatRef = await findRefById(chatsCollection, id);
    const messagesCollection = collection(chatRef.ref, "messages");
    const message = await addDoc(messagesCollection, {
      senderId: userData.uid,
      createdAt: Date.now(),
      messageId: uuid(),
      isChecked: false,
      type: "text",
      content,
    } as Message);

    if (message) {
      return res.status(200).send({ success: true, data: message });
    } else {
      return res
        .status(400)
        .send({ success: false, data: "Cannot Post Message" });
    }
  }
}

const chatsController = new ChatsController();

export { chatsController };
