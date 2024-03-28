import { Request, Response } from "express";
import verifyUserData from "../jwt/verifyUserData";

class Middleware {
  async verifyUser(req: Request, res: Response) {
    const token = req.body.token || req.headers.token;
    if (!token) {
      return res.status(401).send({ success: false, data: "Unauthorized" });
    }

    const userData = verifyUserData(token);
    if (!userData) {
      return res.status(401).send({ success: false, data: "Unauthorized" });
    }

    req.body.userData = userData;
  }
}

const middleware = new Middleware();
export { middleware };
