import express from "express";
import {
  edit,
  finishKakaoLogin,
  logout,
  see,
  startKakaoLogin,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/kakao/start", startKakaoLogin);
userRouter.get("/kakao/finish", finishKakaoLogin);
userRouter.get(":id", see);

export default userRouter;
