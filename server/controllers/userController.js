import session from "express-session";
import User, { verifyPassword } from "../models/User.js";
import { sessionizeUser, socialSessionizeUser } from "../util/helpers.js";

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
export const getProfile = (req, res) => {
  return res.status(200).send("User Profile");
};
export const getEdit = (req, res) => {
  return res.status(200).send({ message: "Get edit User" });
};
export const postEdit = async (req, res) => {
  const {
    body: {
      profile,
      profileForm: { username, intro },
    },
  } = req;
  const existingUser = profile.user;
  let exists = undefined;
  console.log("existingUser: ", existingUser);
  if (existingUser.username !== username) {
    exists = await User.exists({ username });
    console.log(exists);
  }
  console.log("line: 140 exists: ", exists);
  if (!exists) {
    const updateUser = await User.findByIdAndUpdate(
      existingUser.id,
      {
        username,
        intro,
      },
      { new: true }
    );
    return res.status(200).send({ updateUser, message: "Update success" });
  }
  return res.status(200).send({ message: "Have no change" });
};
export const remove = (req, res) => res.send("Remove User");
export const see = (req, res) => res.send("See user");
export const search = (req, res) => res.send("Search user");
