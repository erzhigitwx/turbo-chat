import { Request, Response } from "express";
import { getDocsAll } from "../models/firebase";
import { usersCollection } from "../config";
import { UserData } from "../types/user";

class UsersController {
  async getUser(req: Request, res: Response) {
    const { userData, opponentId } = req.body;
    const users = await getDocsAll(usersCollection);
    const opponent = users.filter((user) => user.uid === opponentId)[0];

    if (opponent) {
      return res.status(200).send({ success: true, data: opponent });
    } else {
      return res.status(400).send({ success: false, data: "Cannot Get User" });
    }
  }
}

const usersController = new UsersController();

export { usersController };
