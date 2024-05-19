import { Router } from "express";
import { registrationController } from "../controllers/registration.controller.js";

const registrationRoute = Router();

registrationRoute.post(
  "/reg/validate",
  registrationController.validateRegistration,
);
registrationRoute.post("/reg/registrate", registrationController.registrate);
registrationRoute.post("/reg/login", registrationController.login);

export { registrationRoute };
