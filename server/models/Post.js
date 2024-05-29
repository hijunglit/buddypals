import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  text: String,
  createdAt: Date,
  hashtags: [{ type: String }],
  comments: [{ date: Date }],
});

const Post = mongoose.model("Post", postSchema);
export default Post;
