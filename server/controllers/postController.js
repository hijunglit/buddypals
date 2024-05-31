import Post from "../models/Post.js";

export const home = async (req, res) => {
  try {
    const posts = await Post.find({});
    console.log("fetching posts successful", posts);
    return res.send(posts).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetchgin posts data");
  }
};
export const see = (req, res) => {
  console.log("the router parameter is", req.params.id);
  return res.send(`Watch Post #${req.params.id}`);
};
export const getEdit = (req, res) => {
  return res.send("Edit", { pageTitle: "Editing" });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.send(`post edit`);
};
export const getUpload = (req, res) => {
  return res.send("Get upload");
};
export const postUpload = async (req, res) => {
  const { text, hashtags } = req.body;
  try {
    const post = new Post({
      text,
      createdAt: Date.now(),
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    console.log(post);
    await Post.create({
      text,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.send(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
};
export const deletePost = (req, res) => {
  return res.send("Delete post");
};
