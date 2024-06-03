import express from "express";
import {
  getJoin,
  login,
  postJoin,
  search,
} from "../controllers/userController.js";
import { home } from "../controllers/postController.js";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/login", login);
rootRouter.get("/search", search);

export default rootRouter;
