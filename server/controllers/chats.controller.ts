import { Request, Response } from "express";
import { addToCollection, getDocsAll } from "../models/firebase";
import { chatsCollection, usersCollection } from "../config";
import { UserData } from "../types/user";
import { uuid } from "../utils";
import { Chat } from "../types/Chat";

class ChatsController {
  async createChat(req: Request, res: Response) {
    const body = req.body;
    const { opponentId, userData } = body;

    const createdChat = await addToCollection(chatsCollection, {
      id: uuid(),
      opponentId,
      creatorId: userData.uid,
      messages: [],
      deletedFor: [],
    } as Chat);

    if (createdChat.success) {
      return res.status(200).send({ success: true, data: createdChat.data });
    } else {
      return res
        .status(400)
        .send({ success: false, data: "Cannot Create Chat" });
    }
  }

  async getChats(req: Request, res: Response) {
    const body = req.body;
    const { userData } = body;

    const chats = await getDocsAll(chatsCollection);
    chats.filter((chat) => {
      if (chat.creatorId === userData.uid || chat.opponentId === userData.uid)
        return chat;
    });
    if (chats) {
      return res.status(200).send({ success: true, data: chats });
    } else {
      return res.status(400).send({ success: false, data: "Cannot Get Chats" });
    }
  }

  async searchUsers(req: Request, res: Response) {
    const body = req.body;
    const { query } = body;
    const users: UserData[] = await getDocsAll(usersCollection);
    const result = !!query
      ? users.filter((user) =>
          user.login.toLowerCase().startsWith(query.toLowerCase()),
        )
      : [];
    if (result) {
      return res.status(200).send({ success: true, data: result });
    } else {
      return res
        .status(400)
        .send({ success: false, data: "Internal Server Error" });
    }
  }
}

const chatsController = new ChatsController();

export { chatsController };
