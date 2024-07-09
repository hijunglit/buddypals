import express from "express";
import { createComment } from "../controllers/postController.js";

const apiRouter = express.Router();

apiRouter.post("/post/:id([0-9a-f]{24})/comments", createComment);

export default apiRouter;
