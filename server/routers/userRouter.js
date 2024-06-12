import express from "express";
import {
  finishKakaoLogin,
  getEdit,
  logout,
  postEdit,
  see,
  startKakaoLogin,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.route("/edit").get(getEdit).post(postEdit);
userRouter.get("/kakao/start", startKakaoLogin);
userRouter.post("/kakao/finish", finishKakaoLogin);
userRouter.get(":id", see);

export default userRouter;
