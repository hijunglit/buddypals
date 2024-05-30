import Post from "../models/Post.js";

export const home = async (req, res) => {
  Post.find()
    .then(function (posts) {
      console.log("finish", posts);
      return res.send(posts);
    })
    .catch(function (err) {
      console.log("errors", err);
    });
  console.log("I finish first");
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
export const postUpload = (req, res) => {
  const { title } = req.body;
  return res.send("Upload");
};
export const deletePost = (req, res) => {
  return res.send("Delete post");
};
