import express from "express";
import {
  getEdit,
  getUpload,
  postUpload,
  see,
} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.get("/:id([0-9a-f]{24})", see);
postRouter.get("/:id([0-9a-f]{24})/edit", getEdit);
postRouter.route("/upload").get(getUpload).post(postUpload);

export default postRouter;
