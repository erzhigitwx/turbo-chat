import { Event } from "socket.io";
import verifyUserData from "../../jwt/verify-user-data";

class SocketMiddleware {
  async verifyToken(event: Event, next: (err?: Error | undefined) => void) {
    const [path, data] = event;

    const userData = verifyUserData(data.token);
    if (!userData) return next(new Error("Unauthorized"));

    event[1].userData = userData;

    next();
  }
}

const socketMiddleware = new SocketMiddleware();

export default socketMiddleware;
