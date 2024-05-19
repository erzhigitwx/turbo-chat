import { Router } from "express";
import { middleware } from "../middleware/middleware.js";
import { usersController } from "../controllers/users.controller.js";

const usersRouter = Router();
usersRouter.use("/users/*", middleware.verifyUser);

usersRouter.post("/users/get-user", usersController.getUser);

export { usersRouter };
