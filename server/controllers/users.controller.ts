import { Request, Response } from "express";
import { findRefById, getDocsAll, updateDocField } from "../models/firebase.js";
import { usersCollection } from "../config/index.js";
import { UserData } from "../types/user.js";

class UsersController {
  async getUser(req: Request, res: Response) {
    const { userData, id } = req.body;
    const users = await getDocsAll(usersCollection);
    const user = users.find((user) => user.uid === id);

    if (!id) return res.status(200).send({ success: true, data: userData });

    if (user) {
      return res.status(200).send({ success: true, data: user });
    } else {
      return res.status(400).send({ success: false, data: "Cannot Get User" });
    }
  }

  async updateLastOnline(uid: string) {
    const users = (await getDocsAll(usersCollection)) as UserData[];
    const currentUser = users.find((user) => user.uid === uid);
    const currentUserRef = await findRefById(usersCollection, "uid", uid);

    if (!currentUser) return;

    const res = await updateDocField(currentUserRef.ref, {
      lastLoginAt: Date.now(),
    });
  }
}

const usersController = new UsersController();

export { usersController };
