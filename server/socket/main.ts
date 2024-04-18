import { Server } from "socket.io";
import onlineController from "./controllers/online.controller";

export function startSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("A user connected with id", socket.id);
    onlineController(io, socket);

    socket.on("disconnect", () => {
      socket.rooms.forEach((e) => {
        socket.leave(e);
      });
    });
  });
}
