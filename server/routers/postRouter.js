import express from "express";
import {
  getEdit,
  getUpload,
  postEdit,
  postUpload,
  see,
} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.get("/:id([0-9a-f]{24})", see);
postRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
postRouter.route("/upload").get(getUpload).post(postUpload);

export default postRouter;
