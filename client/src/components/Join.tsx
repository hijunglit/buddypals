import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IJoinForm {
  name: string;
  email: string;
  username: string;
  password: string;
}

function Join() {
  const navigate = useNavigate();
  const [form, setForm] = useState<IJoinForm>({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:5050/join");
      const json = await response.json();
      setForm(json);
    })();
  }, []);
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
    } catch (err) {
      console.error("A problem occurred with your fetch operation: ", err);
    } finally {
      setForm({ name: "", email: "", username: "", password: "" });
      navigate("/");
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        name='name'
        type='text'
        value={form.name || ""}
        placeholder='name'
        onChange={(e) => updateForm({ name: e.target.value })}
        required
      />
      <input
        name='email'
        type='email'
        value={form.email || ""}
        placeholder='email'
        onChange={(e) => updateForm({ email: e.target.value })}
        required
      />
      <input
        name='username'
        type='text'
        value={form.username || ""}
        placeholder='username'
        onChange={(e) => updateForm({ username: e.target.value })}
        required
      />
      <input
        name='password'
        type='password'
        value={form.password || ""}
        placeholder='password'
        autoComplete='off'
        onChange={(e) => updateForm({ password: e.target.value })}
        required
      />
      <input type='submit' value='Join' />
    </form>
  );
}

export default Join;
