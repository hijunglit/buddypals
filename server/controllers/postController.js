import Post from "../models/Post.js";

export const home = async ({ session: { user } }, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: "desc" });
    return res.send({ user, posts }).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching posts data");
  }
};
export const see = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("owner");
  console.log(post);
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
  const { text, hashtags } = req.body;
  const post = await Post.exists({ _id: id });
  if (!post) {
    return res.send("post Not found").status(404);
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
    const path = image.map((img) => img.path);
    try {
      const result = await Post.create({
        img: files ? path : "",
        text,
        hashtags: Post.formatHashtags(hashtags),
        owner: loggedInUser.id,
      });
      return res.send(result).status(204);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Error updating record" });
    }
  }
};
export const deletePost = async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  return res.send("Delete post");
};
