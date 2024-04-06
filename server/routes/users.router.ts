import { Router } from "express";
import { middleware } from "../middleware/middleware";
import { usersController } from "../controllers/users.controller";

const usersRouter = Router();
usersRouter.use("/users/*", middleware.verifyUser);

usersRouter.post("/users/get-user", usersController.getUser);

export { usersRouter };
