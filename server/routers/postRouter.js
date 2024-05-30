import express from "express";
import {
  deletePost,
  getEdit,
  postUpload,
  see,
} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.get("/:id(\\d+)", see);
postRouter.get("/:id(\\d+)/edit", getEdit);
postRouter.get("/:id(\\d+)/delete", deletePost);
postRouter.get("/upload", postUpload);

export default postRouter;
