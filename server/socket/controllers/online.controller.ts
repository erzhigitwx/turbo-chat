import { Server, Socket } from "socket.io";
import { UserData } from "../../types/user.js";
import { usersController } from "../../controllers/users.controller.js";
import { userSocketRoomPrefix } from "../../constants/index.js";
import { isOnline } from "../../utils/index.js";
import { socketMiddlewareRouting } from "../middleware/socket-middleware-routing.js";
import socketMiddleware from "../middleware/middleware.js";

const visitorsRoomPrefix = "visitors_";

function onlineController(io: Server, socket: Socket) {
  socket.use(
    socketMiddlewareRouting(socketMiddleware.verifyToken, [
      "user-connect",
      "user-disconnect",
    ]),
  );

  socket.on("user-connect", async (body: { userData: UserData }) => {
    const { userData } = body;
    const { uid } = userData;

    if (!uid || typeof uid !== "string") return;

    await usersController.updateLastOnline(uid);
    io.to(visitorsRoomPrefix + uid).emit("profile-owner-connect");
    io.emit("profile-owner-connect", { uid });
    socket.emit("profile-owner-connect");

    socket.join(userSocketRoomPrefix + uid);
  });

  socket.on("user-disconnect", async (body: { userData: UserData }) => {
    const { userData } = body;
    const { uid } = userData;

    socket.leave(userSocketRoomPrefix + uid);

    if (!isOnline(uid)) {
      await usersController.updateLastOnline(uid);
      io.to(visitorsRoomPrefix + uid).emit("profile-owner-disconnect");
    }
  });
}

export default onlineController;
