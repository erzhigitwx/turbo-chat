import { Event } from "socket.io";
import verifyUserData from "../../jwt/verify-user-data";
import { verifyChatMember } from "../../utils";

class SocketMiddleware {
  async verifyToken(event: Event, next: (err?: Error | undefined) => void) {
    const [path, data] = event;

    const userData = verifyUserData(data.token);
    if (!userData) return next(new Error("Unauthorized"));

    event[1].userData = userData;

    next();
  }

  async verifyChatMember(
    event: Event,
    next: (err?: Error | undefined) => void,
  ) {
    const [path, data] = event;

    const { token, chatId } = data;

    if (!token || !chatId || typeof chatId !== "string")
      return next(new Error("Chat member unauthorized"));

    const userData = verifyUserData(token);
    if (!userData) return next(new Error("Chat member unauthorized"));

    const isMember = await verifyChatMember(chatId, userData.uid);

    if (!isMember) {
      return next(new Error("Chat member unauthorized"));
    }

    return next();
  }
}

const socketMiddleware = new SocketMiddleware();

export default socketMiddleware;
