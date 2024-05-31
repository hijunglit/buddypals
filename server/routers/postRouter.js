import express from "express";
import {
  deletePost,
  getEdit,
  getUpload,
  postUpload,
  see,
} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.get("/:id(\\d+)", see);
postRouter.get("/:id(\\d+)/edit", getEdit);
postRouter.get("/:id(\\d+)/delete", deletePost);
postRouter.route("/upload").get(getUpload).post(postUpload);

export default postRouter;
