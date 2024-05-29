import express from "express";
import { deletePost, edit, see, upload } from "../controllers/postControllers";

const postRouter = express.Router();

postRouter.get("/upload", upload);
postRouter.get("/:id", see);
postRouter.get("/:id/edit", edit);
postRouter.get("/:id/delete", deletePost);

export default postRouter;
