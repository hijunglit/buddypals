import User from "../models/User.js";

export const getJoin = (req, res) =>
  res.send({ title: "get join" }).status(200);
export const postJoin = async (req, res) => {
  const { name, username, email, password } = req.body;
  const newUser = await User.create({
    name,
    username,
    email,
    password,
  });
  console.log(newUser);
  return res.send(newUser);
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See user");
export const search = (req, res) => res.send("Search user");
