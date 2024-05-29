import express from "express";
import {
  deletePost,
  edit,
  see,
  upload,
} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.get("/:id(\\d+)", see);
postRouter.get("/:id(\\d+)/edit", edit);
postRouter.get("/:id(\\d+)/delete", deletePost);
postRouter.get("/upload", upload);

export default postRouter;
