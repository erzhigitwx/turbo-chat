import { Request, Response } from "express";
import { generateToken } from "../models/registration.js";
import { UserData } from "../types/user.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, usersCollection } from "../config/index.js";
import { uuid } from "../utils/index.js";
import { addToCollection, getDocsAll } from "../models/firebase.js";
import { doc } from "firebase/firestore";

class RegistrationController {
  async validateRegistration(req: Request, res: Response) {
    const userData = req.body;
    const users = await getDocsAll(usersCollection);
    const isAvailableLogin = !users.some(
      (user) => user.login === userData.login,
    );
    const isValidPassword =
      /^(?=.*[0-9])(?=.*[a-zA-Z])([A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*)(?!.*[\u0400-\u04FF]).{6,16}$/.test(
        userData.password,
      );
    const isEmailExist = users.some((user) => user.email === userData.email);

    if (!isAvailableLogin) {
      return res.status(400).send({
        success: false,
        data: { login: { text: "Login already exists", ok: false } },
      });
    }
    if (!isValidPassword) {
      return res.status(400).send({
        success: false,
        data: {
          password: {
            text: "Password must contain at least one letter, one digit, be between 6 to 16 characters long, and only contain Latin letters.",
            ok: false,
          },
        },
      });
    }
    if (isEmailExist) {
      return res.status(400).send({
        success: false,
        data: { email: { text: "Email already exists", ok: false } },
      });
    }
    return res.status(200).send({ success: true, data: userData });
  }

  async registrate(req: Request, res: Response) {
    const userData = req.body as Omit<
      UserData,
      "uid" | "createdAt" | "lastLoginAt"
    >;
    const users = await getDocsAll(usersCollection);
    const isExistedUser = users.find((user) => user.email === userData.email);
    const userDataFormatted: UserData = {
      login: userData.login,
      email: userData.email,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
      nickname: userData.nickname,
      method: userData.method,
      fullname: {},
      ...(userData.avatar && { avatar: userData.avatar }),
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

    const token = generateToken(
      !!isExistedUser
        ? {
            uid: isExistedUser.uid,
            login: isExistedUser.login,
            email: isExistedUser.email,
          }
        : {
            uid: userDataFormatted.uid,
            login: userDataFormatted.login,
            email: userDataFormatted.email,
          },
    );

    let docResult;
    if (isExistedUser) {
      return res.status(200).send({ success: true, data: token });
    } else {
      docResult = await addToCollection(usersCollection, userDataFormatted);
    }

    if (token && docResult.success) {
      return res.status(200).send({ success: true, data: token });
    } else {
      return res
        .status(400)
        .send({ success: false, data: "Internal Server Error" });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const users = await getDocsAll(usersCollection);
    const user = users.find((user) => user.email === email);

    if (!user) {
      return res.status(400).send({
        success: false,
        data: "No Such User",
        message: "No such user",
      });
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const token = generateToken(user);

      if (token) {
        return res.status(200).send({
          success: true,
          data: token,
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        error: "Incorrect User Data",
        message: "You entered incorrect information",
      });
    }
  }
}

const registrationController = new RegistrationController();

export { registrationController };
