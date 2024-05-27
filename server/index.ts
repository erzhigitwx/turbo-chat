import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { PORT } from "./constants/index.js";
import { registrationRoute } from "./routes/registration.route.js";
import { chatsRoute } from "./routes/chats.route.js";
import { usersRouter } from "./routes/users.router.js";
import { startSocket } from "./socket/main.js";

dotenv.config();
const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.HOST_ORIGIN,
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
