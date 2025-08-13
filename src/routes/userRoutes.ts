import express from "express";
import { getUser } from "../controllers/userControllers";
const routes = express.Router();

routes.get("/:id", getUser);

export default routes;
