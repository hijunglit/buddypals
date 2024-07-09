import express from "express";
import {
  deletePost,
  getEdit,
  getUpload,
  postEdit,
  postUpload,
  see,
} from "../controllers/postController.js";
import { uploadPostImg } from "../middleware.js";

const postRouter = express.Router();

postRouter.get("/:id([0-9a-f]{24})", see);
postRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
postRouter.route("/:id([0-9a-f]{24})/delete").post(deletePost);
postRouter
  .route("/upload")
  .get(getUpload)
  .post(uploadPostImg.array("photos", 3), postUpload);

export default postRouter;
