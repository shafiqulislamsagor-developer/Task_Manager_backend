import express from "express";
import { getIdUser, getUser } from "../controllers/userControllers";
const routes = express.Router();

routes.get("/:id", getIdUser);
routes.get("/", getUser);

export default routes;
