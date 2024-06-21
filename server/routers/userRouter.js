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
import { uploadFiles } from "../middleware.js";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter
  .route("/profile/edit")
  .get(getEdit)
  .post(uploadFiles.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/kakao/start", startKakaoLogin);
userRouter.post("/kakao/finish", finishKakaoLogin);
userRouter.get("/:id", getProfile);

export default userRouter;
