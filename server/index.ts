import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { PORT } from "./constants/index.ts";
import { registrationRoute } from "./routes/registration.route.ts";
import { chatsRoute } from "./routes/chats.route.ts";
import { usersRouter } from "./routes/users.router.ts";
import { startSocket } from "./socket/main.ts";

dotenv.config();
const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
app.use(cors());
app.use(express.json());
app.use("/api", [registrationRoute, chatsRoute, usersRouter]);

startSocket(io);

httpServer.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

export default app;
