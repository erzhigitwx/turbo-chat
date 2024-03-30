import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { UserData } from "../types/user";

dotenv.config();

function verifyUserData(token: string): UserData | undefined {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "") as UserData;
  } catch {
    return undefined;
  }
}

export default verifyUserData;
