import { Server } from "socket.io";
import onlineController from "./controllers/online.controller";
import messageController from "./controllers/message.controller";
import chatController from "./controllers/chats.controller";

export function startSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("A user connected with id", socket.id);
    chatController(io, socket);
    onlineController(io, socket);
    messageController(io, socket);

    socket.on("disconnect", () => {
      socket.rooms.forEach((e) => {
        socket.leave(e);
      });
    });
  });
}
