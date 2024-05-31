import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String }],
});

const Post = mongoose.model("Post", postSchema);
export default Post;
