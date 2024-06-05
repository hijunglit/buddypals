import express from "express";
import { getEdit } from "../controllers/postController.js";
import {
  finishKakaoLogin,
  logout,
  remove,
  see,
  startKakaoLogin,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", getEdit);
userRouter.get("/remove", remove);
userRouter.get("/kakao/start", startKakaoLogin);
userRouter.get("/kakao/finish", finishKakaoLogin);
userRouter.get(":id", see);

export default userRouter;
