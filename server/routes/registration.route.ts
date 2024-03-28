import { Router } from "express";
import { middleware } from "../middleware/middleware";
import { registrationController } from "../controllers/registration.controller";

const registrationRoute = Router();
// registrationRoute.use("/reg/*", middleware.verifyUser);

registrationRoute.post(
  "/reg/validate",
  registrationController.validateRegistration,
);
registrationRoute.post("/reg/registrate", registrationController.registrate);

export { registrationRoute };
