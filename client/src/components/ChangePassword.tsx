import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { authAtom } from "../atoms/atom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { API_BASE_URL } from "../urls";

const Form = styled.form<{ $isbigscreen: boolean }>`
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
const ChangeButton = styled.input`
  background: transparent;
  border: none;
  color: #0095e7;
  cursor: pointer;
  width: fit-content;
  margin: 0 auto;
  font-weight: 700;
  font-size: 1.25em;
`;

function ChangePassword() {
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
  const [profile, setProfile] = useRecoilState(authAtom);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    newPasswordConfirmation: "",
  });
  useEffect(() => {
    (async () => {
      await fetch(`${API_BASE_URL}/users/change-password`);
    })();
  }, []);
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const passwordForm = { ...form };
    const postData = { passwordForm, profile };
    try {
      const response = await fetch(`${API_BASE_URL}/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const json = await response.json();
      if (response.status === 400) {
        return setMessage(json.message);
      }
      if (response.status === 200) {
        await fetch(`${API_BASE_URL}/users/logout`);
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
      <h1 style={{ textAlign: "center", fontSize: "1.6em" }}>비밀번호 변경</h1>
      {message ? <span>{message}</span> : ""}
      <Form onSubmit={onSubmit} $isbigscreen={isTablet || isDesktop}>
        <Input
          name='oldPassword'
          id='oldPassword'
          type='password'
          placeholder='기존 비밀번호'
          autoComplete='off'
          onChange={(e) => updateForm({ oldPassword: e.target.value })}
          value={form.oldPassword}
          required
        />
        <Input
          name='newPassword'
          id='newPassword'
          type='password'
          placeholder='새 비밀번호'
          autoComplete='off'
          onChange={(e) => updateForm({ newPassword: e.target.value })}
          value={form.newPassword}
          required
        />
        <Input
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
        <ChangeButton type='submit' value={"변경"} />
      </Form>
    </>
  );
}

export default ChangePassword;
