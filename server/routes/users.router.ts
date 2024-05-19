import { Router } from "express";
import { middleware } from "../middleware/middleware.ts";
import { usersController } from "../controllers/users.controller.ts";

const usersRouter = Router();
usersRouter.use("/users/*", middleware.verifyUser);

usersRouter.post("/users/get-user", usersController.getUser);

export { usersRouter };
