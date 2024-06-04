import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface IJoinForm {
  name: string;
  email: string;
  username: string;
  password: string;
  password2: string;
}

function Join() {
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
      navigate("/");
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
      <form onSubmit={onSubmit}>
        <input
          name='name'
          type='text'
          value={form.name || ""}
          placeholder='이름'
          onChange={(e) => updateForm({ name: e.target.value })}
          required
        />
        <input
          name='email'
          type='email'
          value={form.email || ""}
          placeholder='이메일'
          onChange={(e) => updateForm({ email: e.target.value })}
          required
        />
        <input
          name='username'
          type='text'
          value={form.username || ""}
          placeholder='사용자 이름'
          onChange={(e) => updateForm({ username: e.target.value })}
          required
        />
        <input
          name='password'
          type='password'
          value={form.password || ""}
          placeholder='비밀번호'
          autoComplete='off'
          onChange={(e) => updateForm({ password: e.target.value })}
          required
        />
        <input
          name='password2'
          type='password'
          value={form.password2 || ""}
          placeholder='비밀번호 확인'
          autoComplete='off'
          onChange={(e) => updateForm({ password2: e.target.value })}
          required
        />
        <input type='submit' value='계정 만들기' />
      </form>
      <hr />
      <div>
        <span>이미 계정이 있으신가요?</span>
        <Link to={"/login"}>지금 로그인 하기 &rarr;</Link>
      </div>
    </>
  );
}

export default Join;
