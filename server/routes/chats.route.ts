import { Router } from "express";
import { middleware } from "../middleware/middleware.js";
import { chatsController } from "../controllers/chats.controller.js";

const chatsRoute = Router();
chatsRoute.use("/chats/*", middleware.verifyUser);

chatsRoute.post("/chats/search-users", chatsController.searchUsers);
chatsRoute.post("/chats/create-chat", chatsController.createChat);
chatsRoute.post("/chats/get-chats", chatsController.getChats);
chatsRoute.post("/chats/get-chat-media", chatsController.getChatMedia);
chatsRoute.post("/chats/manage-chat", chatsController.manageChat);

export { chatsRoute };
