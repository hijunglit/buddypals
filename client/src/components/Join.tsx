import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const JoinForm = styled.form<{ $isbigscreen: boolean }>`
  display: flex;
  width: ${(props) => (props.$isbigscreen ? "40%" : null)};
  flex-direction: column;
  gap: 0.625em;
  padding: 1em;
  margin: ${(props) => (props.$isbigscreen ? "0 auto" : null)};
`;
const Input = styled.input`
  background: transparent;
  border: 1px solid #fff;
  border-radius: 12px;
  padding: 12px;
  color: #fff;
`;
const JoinButton = styled.input`
  background: transparent;
  border: none;
  color: #0095e7;
  cursor: pointer;
  width: fit-content;
  margin: 0 auto;
  font-weight: 700;
  font-size: 1.25em;
`;
const SignIn = styled.div<{ $isbigscreen: boolean }>`
  width: ${(props) => (props.$isbigscreen ? "40%" : null)};
  margin: ${(props) => (props.$isbigscreen ? "0 auto" : null)};
`;
interface IJoinForm {
  name: string;
  email: string;
  username: string;
  password: string;
  password2: string;
}

function Join() {
  const isDesktop: boolean = useMediaQuery({ minWidth: 992 });
  const isTablet: boolean = useMediaQuery({
    minWidth: 768,
    maxWidth: 991,
  });
  const isMobile: boolean = useMediaQuery({
    maxWidth: 767,
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<IJoinForm>({
    name: "",
    email: "",
    username: "",
    password: "",
    password2: "",
  });
  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:5050/join");
      const json = await response.json();
      console.log(json);
    })();
  }, [message.length]);
  function updateForm(value: any) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = { ...form };
    try {
      let response;
      response = await fetch(`http://localhost:5050/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const results = await response.json();
      if (results.message) {
        return setMessage(results.message);
      }
      navigate("/login");
    } catch (err) {
      console.error("A problem occurred with your fetch operation: ", err);
    } finally {
      setForm({
        name: "",
        email: "",
        username: "",
        password: "",
        password2: "",
      });
    }
  };
  return (
    <>
      {message ? <span>{message}</span> : ""}
      <JoinForm onSubmit={onSubmit} $isbigscreen={isTablet || isDesktop}>
        <Input
          name='name'
          type='text'
          value={form.name || ""}
          placeholder='이름'
          onChange={(e) => updateForm({ name: e.target.value })}
          required
        />
        <Input
          name='email'
          type='email'
          value={form.email || ""}
          placeholder='이메일'
          onChange={(e) => updateForm({ email: e.target.value })}
          required
        />
        <Input
          name='username'
          type='text'
          value={form.username || ""}
          placeholder='사용자 이름'
          onChange={(e) => updateForm({ username: e.target.value })}
          required
        />
        <Input
          name='password'
          type='password'
          value={form.password || ""}
          placeholder='비밀번호'
          autoComplete='off'
          onChange={(e) => updateForm({ password: e.target.value })}
          required
        />
        <Input
          name='password2'
          type='password'
          value={form.password2 || ""}
          placeholder='비밀번호 확인'
          autoComplete='off'
          onChange={(e) => updateForm({ password2: e.target.value })}
          required
        />
        <JoinButton type='submit' value='계정 만들기' />
      </JoinForm>
      <SignIn $isbigscreen={isTablet || isDesktop}>
        <hr />
        <span>이미 계정이 있으신가요?</span>
        <Link to={"/login"}>
          <span style={{ color: "#0095e7" }}>지금 로그인 하기 &rarr;</span>
        </Link>
      </SignIn>
    </>
  );
}

export default Join;
