import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface ILoginForm {
  username: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<ILoginForm>({
    username: "",
    password: "",
  });
  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:5050/login");
      const json = await response.json();
      console.log(json);
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
      if (result.message) {
        setMessage(result.message);
      }
      console.log(result);
    } catch (err) {
      console.error("A problem occurred with your fetch operation: ", err);
    } finally {
      setForm({ username: "", password: "" });
    }
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
      </div>
    </>
  );
}

export default Login;
