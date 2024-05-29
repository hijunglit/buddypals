import express from "express";

const postRouter = express.Router();

const handleSeePost = (req, res) => res.send("See post");

postRouter.get("/see", handleSeePost);

export default postRouter;
