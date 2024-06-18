import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { authAtom } from "../atoms/atom";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useRecoilState(authAtom);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    newPasswordConfirmation: "",
  });
  useEffect(() => {
    (async () => {
      await fetch("http://localhost:5050/users/change-password");
    })();
  }, []);
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const passwordForm = { ...form };
    const postData = { passwordForm, profile };
    try {
      const response = await fetch(
        "http://localhost:5050/users/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );
      const json = await response.json();
      console.log(json);
      if (response.status === 400) {
        return setMessage(json.message);
      }
      if (response.status === 200) {
        await fetch("http://localhost:5050/users/logout");
        setProfile({
          user: null,
          isAuthenticated: false,
        });
        return navigate("/login");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setForm({
        oldPassword: "",
        newPassword: "",
        newPasswordConfirmation: "",
      });
    }
  };
  function updateForm(value: any) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }
  return (
    <>
      <h1>비밀번호 변경</h1>
      {message ? <span>{message}</span> : ""}
      <form onSubmit={onSubmit}>
        <input
          name='oldPassword'
          id='oldPassword'
          type='password'
          placeholder='기존 비밀번호'
          autoComplete='off'
          onChange={(e) => updateForm({ oldPassword: e.target.value })}
          value={form.oldPassword}
          required
        />
        <input
          name='newPassword'
          id='newPassword'
          type='password'
          placeholder='새 비밀번호'
          autoComplete='off'
          onChange={(e) => updateForm({ newPassword: e.target.value })}
          value={form.newPassword}
          required
        />
        <input
          name='newPasswordConfirmation'
          id='newPasswordConfirmation'
          type='password'
          placeholder='새 비밀번호 확인'
          autoComplete='off'
          onChange={(e) =>
            updateForm({ newPasswordConfirmation: e.target.value })
          }
          value={form.newPasswordConfirmation}
          required
        />
        <input type='submit' value={"변경"} />
      </form>
    </>
  );
}

export default ChangePassword;
