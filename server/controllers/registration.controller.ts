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
    const isEmailExist = users.some((user) => user.email === userData.email);

    if (!isAvailableLogin) {
      return res
        .status(400)
        .send({ success: false, data: "Login already exists" });
    }
    if (!isValidPassword) {
      return res
        .status(400)
        .send({
          success: false,
          data: "Password must contain at least one letter, one digit, and be between 6 to 16 characters long",
        });
    }
    if (isEmailExist) {
      return res
        .status(400)
        .send({ success: false, data: "Email already exists" });
    }
    return res.status(200).send({ success: true, data: userData });
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

    const token = generateToken(userDataFormatted);

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
