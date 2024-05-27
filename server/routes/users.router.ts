import { Router } from "express";
import { middleware } from "../middleware/middleware.js";
import { usersController } from "../controllers/users.controller.js";
import multer from "multer";
import { mb } from "../constants/index.js";

const usersRouter = Router();
usersRouter.use("/users/*", middleware.verifyUser);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * mb },
});

usersRouter.post("/users/get-user", usersController.getUser);
usersRouter.use("/users/set-avatar", upload.single("avatar"));
usersRouter.post("/users/set-avatar", usersController.setAvatar);
usersRouter.post("/users/manage-user", usersController.manageUser);

export { usersRouter };
