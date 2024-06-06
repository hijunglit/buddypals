import User, { verifyPassword } from "../models/User.js";

export const getJoin = (req, res) =>
  res.send({ pageTitle: "Join" }).status(200);
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
export const getLogin = (req, res) => res.send({ pageTitle: "Login" });
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).send({ message: "사용자를 찾을 수 없습니다." });
  }
  const verified = await verifyPassword(password, user.salt, user.password);
  if (!verified) {
    return res.status(401).send({ message: "비밀번호가 일치하지 않습니다." });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.send({ message: "login success" }).status(200);
};
export const startKakaoLogin = (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_CLIENT,
    redirect_url: process.env.KAKAO_REDIRECT,
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const clientId = process.env.KAKAO_CLIENT;
  return res.send({ clientId }).status(200);
};
export const finishKakaoLogin = async (req, res) => {
  const baseUrl = "	https://kauth.kakao.com/oauth/token";
  const config = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_CLIENT,
    redirect_uri: "http://localhost:5050/users/kakao/finish",
    code: req.query.code,
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
    console.log(userData);
    const nickname = userData.kakao_account.profile.nickname;
    if (!nickname) {
      return res.send(userData);
    }
  } else {
    return res.send("login failed");
  }
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See user");
export const search = (req, res) => res.send("Search user");
