import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authAtom } from "../atoms/atom";
import styled from "styled-components";

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.625em;
  padding: 1em;
`;
const Input = styled.input`
  background: transparent;
  border: 1px solid #fff;
  border-radius: 12px;
  padding: 12px;
  color: #fff;
`;
const LoginButton = styled.input`
  background: transparent;
  border: none;
  color: #0095e7;
  cursor: pointer;
  width: fit-content;
  margin: 0 auto;
  font-weight: 700;
  font-size: 1.25em;
`;
const LoginMethod = styled.div`
  width: fit-content;
  margin: 0 auto;
`;
const KakaoLogin = styled.button`
  background-color: #ffe812;
  border: 2px solid #000;
  border-radius: 8px;
  color: #000;
  padding: 8px 12px;
  font-weight: 800;
`;
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
          thumbnailImage: String(user.thumbnailImageUrl),
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
      <LoginForm onSubmit={onSubmit}>
        <Input
          type='text'
          placeholder='사용자 이름'
          name='username'
          value={form.username || ""}
          onChange={(e) => {
            updateForm({ username: e.target.value });
          }}
          required
        />
        <Input
          type='password'
          placeholder='비밀번호'
          name='password'
          value={form.password || ""}
          autoComplete='off'
          onChange={(e) => updateForm({ password: e.target.value })}
          required
        />
        <LoginButton type='submit' value={"로그인"} />
      </LoginForm>
      <hr />
      <LoginMethod>
        <Link to={"/join"}>새 계정 만들기 &rarr;</Link>
        <KakaoLogin onClick={handleLogin}>카카오 로그인 &rarr;</KakaoLogin>
      </LoginMethod>
    </>
  );
}

export default Login;
