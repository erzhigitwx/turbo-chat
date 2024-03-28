import { Request, Response } from "express";
import { generateToken } from "../models/registration";
import { UserData } from "../types/user";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, usersCollection } from "../config";
import { uuid } from "../utils";
import { addToCollection, getDocsAll } from "../models/firebase";

class RegistrationController {
  async validateRegistration(req: Request, res: Response) {
    const userData = req.body;
    const users = await getDocsAll(usersCollection);
    const isAvailableLogin = !users.some(
      (user) => user.login === userData.login,
    );
    const isValidPassword = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/.test(
      userData.password,
    );

    if (isAvailableLogin && isValidPassword) {
      return res.status(200).send({ success: true, data: userData });
    } else {
      return res.status(400).send({ success: false, data: "uncorrect data" });
    }
  }

  async registrate(req: Request, res: Response) {
    const userData = req.body as Omit<
      UserData,
      "uid" | "createdAt" | "lastLoginAt"
    >;

    const userDataFormatted: UserData = {
      login: userData.login,
      email: userData.email,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
      nickname: userData.nickname,
      method: userData.method,
      uid: uuid(),
    };

    if (userDataFormatted.method === "default") {
      const user = await createUserWithEmailAndPassword(
        auth,
        userDataFormatted.email,
        userData.password,
      );
      await sendEmailVerification(user.user);
    }

    const token = generateToken({
      email: userData.email,
      nickname: userData.nickname,
    });

    const docResult = await addToCollection(usersCollection, userDataFormatted);

    if (token && docResult.success) {
      return res.status(200).send({ success: true, data: token });
    } else {
      return res
        .status(400)
        .send({ success: false, data: "Internal Server Error" });
    }
  }
}

const registrationController = new RegistrationController();

export { registrationController };
