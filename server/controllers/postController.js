import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const home = async ({ session: { user } }, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: "desc" })
      .populate("owner")
      .populate({ path: "comments", populate: "owner" });
    return res.send({ user, posts }).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching posts data");
  }
};
export const see = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id)
    .populate("owner")
    .populate({ path: "comments", populate: "owner" });
  if (!post) {
    return res.send("post Not found").status(404);
  }
  return res.status(200).send({ post });
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
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    post: { text, hashtags },
    user,
  } = req.body;
  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).send("post Not found");
  }
  if (String(post.owner) !== String(user.id)) {
    return res.status(403).send({ message: "doesn't match owner and user." });
  }
  await Post.findByIdAndUpdate(id, {
    text,
    hashtags: Post.formatHashtags(hashtags),
  });
  return res.send(`post edit`);
};
export const getUpload = (req, res) => {
  return res.status(200).send({ message: "Get upload" });
};
export const postUpload = async (req, res) => {
  const {
    body: { text, hashtags },
    files,
  } = req;
  const loggedInUser = JSON.parse(req.body.profile);
  if (files) {
    const image = req.files;
    const path = image.map((img) => img.location);
    try {
      const result = await Post.create({
        img: files ? path : "",
        text,
        hashtags: Post.formatHashtags(hashtags),
        owner: loggedInUser.id,
      });
      const user = await User.findById(loggedInUser.id);
      user.posts.push(result._id);
      user.save();
      return res.send(result).status(204);
    } catch (err) {
      res.status(500).send({ result, message: "Error updating record" });
    }
  }
};
export const deletePost = async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  const post = await Post.findById(id);
  const sessionUser = await User.findById(user.id);
  if (!post) {
    return res.status(404).send({ message: "Post not found." });
  }
  if (String(post.owner) !== String(user.id)) {
    return res.status(403).send({ message: "Authentication error" });
  }
  await Post.findByIdAndDelete(id);
  sessionUser.posts.splice(sessionUser.posts.indexOf(id), 1);
  sessionUser.save();
  return res.send("Delete post");
};
export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text, profile },
  } = req;
  const loggedInUser = JSON.parse(profile);
  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).send({ message: "Not post found" });
  }
  const comment = await Comment.create({
    text,
    owner: loggedInUser.id,
    post: id,
  });
  post.comments.push(comment._id);
  post.save();
  return res.status(201).send(post);
};
