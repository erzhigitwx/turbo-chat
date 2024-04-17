import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { PORT } from "./constants";
import { registrationRoute } from "./routes/registration.route";
import { chatsRoute } from "./routes/chats.route";
import { usersRouter } from "./routes/users.router";

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
app.use(cors());
app.use(express.json());
app.use("/api", [registrationRoute, chatsRoute, usersRouter]);

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
});

httpServer.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
