import jwt from "jsonwebtoken";
import { UserData } from "../types/user.js";

export function generateToken(userData: UserData) {
  const token = jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: "48h",
  });

  return token;
}
