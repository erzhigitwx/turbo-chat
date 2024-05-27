import { Request, Response } from "express";
import { findRefById, getDocsAll, updateDocField } from "../models/firebase.js";
import { storage, usersCollection } from "../config/index.js";
import { UserData } from "../types/user.js";
import { updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

class UsersController {
  async getUser(req: Request, res: Response) {
    const { userData, id } = req.body;
    const users = await getDocsAll(usersCollection);
    const user = users.find((user) => {
      if (id) {
        if (user.uid === id) return user;
      } else {
        if (user.uid === userData.uid) return user;
      }
    });

    if (user) {
      return res.status(200).send({ success: true, data: user });
    } else {
      return res.status(400).send({ success: false, data: "Cannot Get User" });
    }
  }

  async setAvatar(req, res) {
    const file = req.file;

    if (!file || !file.originalname) {
      return res
        .status(400)
        .send({ success: false, data: "File is missing or has no name" });
    }
    const avatarRef = ref(storage, `avatars/${file.originalname}`);

    try {
      await uploadBytes(avatarRef, file.buffer);
      const imageUrl = await getDownloadURL(avatarRef);
      return res.status(200).send({ success: true, data: imageUrl });
    } catch (error) {
      return res
        .status(500)
        .send({ success: false, data: "Internal server error" });
    }
  }

  async manageUser(req: Request, res: Response) {
    const { userData, node } = req.body;
    const userRef = await findRefById(usersCollection, "uid", userData.uid);
    await updateDoc(userRef.ref, node);

    if (userRef.exists()) {
      return res.status(200).send({ success: true, data: userData });
    } else {
      return res
        .status(400)
        .send({ success: false, data: "Cannot Update User" });
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
