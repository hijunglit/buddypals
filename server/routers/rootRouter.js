import express from "express";
import {
  getAuth,
  getJoin,
  getLogin,
  postJoin,
  postLogin,
  search,
} from "../controllers/userController.js";
import { home } from "../controllers/postController.js";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/status", getAuth);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
