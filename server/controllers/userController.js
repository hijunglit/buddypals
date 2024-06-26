import session from "express-session";
import User, { verifyPassword } from "../models/User.js";
import { sessionizeUser, socialSessionizeUser } from "../util/helpers.js";
import Post from "../models/Post.js";

export const getJoin = (req, res) => {
  res.send({ pageTitle: "Join" }).status(200);
};
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2 } = req.body;
  if (password !== password2) {
    return res.send({ message: "password confirm failed" }).status(401);
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res
      .status(401)
      .send({ message: "사용자이름/ 이메일이 이미 존재합니다." });
  }
  try {
    const newUser = await User.create({
      name,
      username,
      email,
      password,
    });
    return res.send(newUser).status(200);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error create new user");
  }
};
export const getLogin = (req, res) => {
  return res.send({ pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(401).send({ message: "사용자를 찾을 수 없습니다." });
  }
  const verified = await verifyPassword(password, user.salt, user.password);
  if (!verified) {
    return res.status(401).send({ message: "비밀번호가 일치하지 않습니다." });
  }
  const sessionUser = sessionizeUser(user);
  req.session.loggedIn = true;
  req.session.user = sessionUser;
  return res.send({ message: "login success", user: sessionUser }).status(200);
};
export const startKakaoLogin = (req, res) => {
  const clientId = process.env.KAKAO_CLIENT;
  return res.send({ clientId }).status(200);
};
export const finishKakaoLogin = async (req, res) => {
  const baseUrl = "	https://kauth.kakao.com/oauth/token";
  const config = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_CLIENT,
    redirect_uri: "http://localhost:3000/users/kakao/finish",
    code: req.body.code,
    client_secret: process.env.KAKAO_SECRET,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://kapi.kakao.com/v2/user/me";
    const userData = await (
      await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-type":
            "Content-type: application/x-www-form-urlencoded;charset=utf-8",
        },
      })
    ).json();
    const profile = userData.kakao_account.profile;
    let user = await User.findOne({
      username: profile.nickname + "(kakao)",
    });
    if (!user) {
      await User.create({
        profileImgUrl: profile.profile_image_url,
        thumbnailImageUrl: profile.thumbnail_image_url,
        name: profile.nickname,
        username: profile.nickname + "(kakao)",
        email: "(소셜 회원의 이메일 정보를 사용할 수 없습니다.)",
        password: "",
        socialOnly: true,
      });
      user = await User.findOne({ username: profile.nickname + "(kakao)" });
      const sessionizeUser = socialSessionizeUser(user);
      req.session.loggedIn = true;
      req.session.user = sessionizeUser;
      console.log("kakao login success");
      return res.send({ user: req.session.user });
    } else {
      const sessionizeUser = socialSessionizeUser(user);
      req.session.loggedIn = true;
      req.session.user = sessionizeUser;
      return res.send({ user: req.session.user });
    }
  } else {
    return res.send({ message: "Token request failed" }).status(400);
  }
};
export const logout = (req, res) => {
  req.session.destroy();
  return res.status(200).send("logged out");
};
export const getProfile = async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  const user = await User.findById(id).populate("posts");
  if (!user) {
    return res.status(404).send({ message: "User not found." });
  }
  return res.status(200).send({ user });
};
export const getEdit = (req, res) => {
  return res.status(200).send({ message: "Get edit User" });
};
export const postEdit = async (req, res) => {
  const {
    body: { username, intro },
    file,
  } = req;
  const loggedInUser = JSON.parse(req.body.profile);
  let exists = undefined;
  if (loggedInUser.username !== String(username)) {
    exists = await User.exists({ username });
  }
  if (exists === null || loggedInUser.intro !== intro || file) {
    const UpdateUser = await User.findByIdAndUpdate(
      loggedInUser.id,
      {
        thumbnailImageUrl: file ? file.path : loggedInUser.thumbnailImage,
        username,
        intro,
      },
      { new: true }
    );
    return res.status(201).send({
      user: UpdateUser,
      message: "사용자 정보가 변경되었습니다.",
    });
  } else if (exists) {
    return res
      .status(400)
      .send({ message: "변경하신 사용자 이름은 이미 존재합니다." });
  }
  return res
    .status(200)
    .send({ message: "사용자 이름이 변경되지 않았습니다." });
};
export const getChangePassword = (req, res) => {
  return res.send("get change password!");
};
export const postChangePassword = async (req, res) => {
  const {
    profile: {
      user: { id },
    },
    passwordForm: { oldPassword, newPassword, newPasswordConfirmation },
  } = req.body;
  const user = await User.findById(id);
  const verified = await verifyPassword(oldPassword, user.salt, user.password);
  if (!verified) {
    return res
      .status(400)
      .send({ message: "기존 비밀번호가 올바르지 않습니다." });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res
      .status(400)
      .send({ message: "새 비밀번호가 일치하지 않습니다." });
  }
  user.password = newPassword;
  await user.save();
  return res.status(200).send({ message: "password change success." });
};
export const remove = (req, res) => res.send("Remove User");
export const search = (req, res) => res.send("Search user");
