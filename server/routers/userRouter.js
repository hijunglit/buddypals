import express from "express";
import { getEdit } from "../controllers/postController.js";
import { logout, remove, see } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", getEdit);
userRouter.get("/remove", remove);
userRouter.get(":id", see);

export default userRouter;
