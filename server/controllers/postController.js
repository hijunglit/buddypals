import Post from "../models/Post.js";

export const home = async (req, res) => {
  try {
    console.log(req.params);
    const posts = await Post.find({});
    return res.send(posts).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching posts data");
  }
};
export const see = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    return res.send("post not found").status(404);
  }
  return res.send(post).status(200);
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    return res.send(post).status(200);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error fetching edit post data");
  }
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
    const result = await Post.create({
      text,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
};
export const deletePost = (req, res) => {
  return res.send("Delete post");
};
