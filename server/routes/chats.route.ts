import { Router } from "express";
import { middleware } from "../middleware/middleware";
import { chatsController } from "../controllers/chats.controller";

const chatsRoute = Router();
chatsRoute.use("/chats/*", middleware.verifyUser);

chatsRoute.post("/chats/search-chat", chatsController.searchChat);
chatsRoute.post("/chats/create-chat", chatsController.createChat);

export { chatsRoute };
