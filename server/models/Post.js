import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  img: { type: String },
  text: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
});

const Post = mongoose.model("Post", postSchema);
export default Post;
