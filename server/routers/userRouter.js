import express from "express";
import {
  finishKakaoLogin,
  getProfile,
  logout,
  getEdit,
  postEdit,
  see,
  startKakaoLogin,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/profile", getProfile);
userRouter.route("/profile/edit").get(getEdit).post(postEdit);
userRouter.get("/kakao/start", startKakaoLogin);
userRouter.post("/kakao/finish", finishKakaoLogin);
userRouter.get(":id", see);

export default userRouter;
