import cors from "cors";
import express from "express";
import { PORT } from "./constants";
import { registrationController } from "./controllers/registration.controller";
import { registrationRoute } from "./routes/registration.route";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());
app.use("/api", [registrationRoute]);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
