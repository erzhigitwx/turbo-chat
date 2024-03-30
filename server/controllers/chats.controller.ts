import { Request, Response } from "express";
import { getDocsAll } from "../models/firebase";
import { usersCollection } from "../config";
import { UserData } from "../types/user";

class ChatsController {
  async createChat(req: Request, res: Response) {
    const body = req.body;
    console.log(body);
  }

  async searchChat(req: Request, res: Response) {
    const body = req.body;
    const { query, userData } = body;
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
