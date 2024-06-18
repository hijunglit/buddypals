import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authAtom } from "../atoms/atom";

interface ILoginForm {
  username: string;
  password: string;
}

function Login() {
  const [authState, setAuthState] = useRecoilState(authAtom);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<ILoginForm>({
    username: "",
    password: "",
  });
  useEffect(() => {
    (async () => {
      await fetch("http://localhost:5050/login");
    })();
  }, []);
  const updateForm = (value: any) => {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const loginInfo = { ...form };
    try {
      const response = await fetch("http://localhost:5050/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();
      if (response.status === 401) {
        return setMessage(result.message);
      }
      const user = result.user;
      console.log(user);
      setAuthState({
        user: {
          username: String(user.username),
          id: String(user.userId),
          social: false,
          intro: String(user.userIntro),
        },
        isAuthenticated: true,
      });
      navigate("/");
    } catch (err) {
      console.error("A problem occurred with your fetch operation: ", err);
    } finally {
      setForm({ username: "", password: "" });
    }
  };
  const handleLogin = async () => {
    const baseUrl = "https://kauth.kakao.com/oauth/authorize";
    const redirectUrl = "http://localhost:3000/users/kakao/finish";
    const responseType = "code";
    const response = await fetch("http://localhost:5050/users/kakao/start");
    const json = await response.json();
    const clientId = json.clientId;
    window.location.href = `${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=${responseType}`;
  };
  return (
    <>
      {message ? <span>{message}</span> : ""}
      <form onSubmit={onSubmit}>
        <input
          type='text'
          placeholder='사용자 이름'
          name='username'
          value={form.username || ""}
          onChange={(e) => {
            updateForm({ username: e.target.value });
          }}
          required
        />
        <input
          type='password'
          placeholder='비밀번호'
          name='password'
          value={form.password || ""}
          autoComplete='off'
          onChange={(e) => updateForm({ password: e.target.value })}
          required
        />
        <input type='submit' value={"로그인"} />
      </form>
      <hr />
      <div>
        <Link to={"/join"}>새 계정 만들기 &rarr;</Link>
        <button onClick={handleLogin}>카카오 로그인 &rarr;</button>
      </div>
    </>
  );
}

export default Login;
