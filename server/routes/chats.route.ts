import { Router } from "express";
import { middleware } from "../middleware/middleware";
import { chatsController } from "../controllers/chats.controller";

const chatsRoute = Router();
chatsRoute.use("/chats/*", middleware.verifyUser);

chatsRoute.post("/chats/search-users", chatsController.searchUsers);
chatsRoute.post("/chats/create-chat", chatsController.createChat);
chatsRoute.post("/chats/get-chats", chatsController.getChats);

export { chatsRoute };
