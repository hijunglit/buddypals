export const posts = (req, res) => {
  console.log("Router parameter is: ", req.params.id);
  return res.send("Home Page Posts");
};
export const see = (req, res) => {
  console.log("the router parameter is", req.params.id);
  return res.send(`Watch Video #${req.params.id}`);
};
export const edit = (req, res) => {
  return res.send("Edit");
};
export const upload = (req, res) => res.send("Upload");
export const deletePost = (req, res) => {
  return res.send("Delete post");
};
