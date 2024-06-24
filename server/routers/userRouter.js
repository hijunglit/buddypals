import express from "express";
import {
  finishKakaoLogin,
  getProfile,
  logout,
  getEdit,
  postEdit,
  startKakaoLogin,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController.js";
import { uploadProfileImg } from "../middleware.js";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter
  .route("/:id/edit")
  .get(getEdit)
  .post(uploadProfileImg.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/kakao/start", startKakaoLogin);
userRouter.post("/kakao/finish", finishKakaoLogin);
userRouter.get("/:id", getProfile);

export default userRouter;
