import { useRecoilState } from "recoil";
import { authAtom } from "../atoms/atom";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiClient } from "../apiClient";

function EditProfile() {
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useRecoilState(authAtom);
  console.log("profile: ", profile);
  const [form, setForm] = useState({
    username: profile.user?.username || "",
    intro: profile.user?.intro || "",
  });
  function updateForm(value: any) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }
  useEffect(() => {
    (async () => {
      await fetch("http://localhost:5050/users/profile/edit");
    })();
  }, []);
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const profileForm = { ...form };
    const postData = { profileForm, profile };
    try {
      const response = await fetch("http://localhost:5050/users/profile/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const result = await response.json();
      console.log(response, result);
      if (response.status === 400) {
        return setMessage(result.message);
      }
      if (response.status === 200) {
        return setMessage("");
      }
      if (response.status === 201) {
        setProfile({
          user: {
            username: String(result.user.username),
            id: String(profile.user?.id),
            social: Boolean(profile.user?.social),
            intro: String(result.user.intro),
          },
          isAuthenticated: profile.isAuthenticated,
        });
        return setMessage(result.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setForm({
        username: profile.user?.username || "",
        intro: profile.user?.intro || "",
      });
    }
  };
  // 프로필 이미지 제출
  const uploadFile = async (file: any) => {
    try {
      const { data } = await apiClient.post("/users/profile/edit", file);
      return data;
    } catch (err) {
      console.error(err);
    }
  };
  const uploadAvatar = async (event: any) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("avatar", event.target.files);
    await uploadFile(formData);
  };
  // 프로필 이미지 미리보기
  const uploadFiles = axios.create({
    baseURL: "http://localhost:5050",
    headers: { "Content-type": "multipart/form-data" },
    timeout: 5000,
  });
  const onFileChanges = (event: any) => {
    const {
      target: { files },
    } = event;
  };
  return (
    <>
      <h1>Edit Profile!</h1>
      <div
        style={{
          borderRadius: "50px",
          overflow: "hidden",
          width: "100px",
          height: "100px",
          backgroundImage: profile.user?.social
            ? `url(${profile.user?.thumbnailImage})`
            : "url(https://www.gravatar.com/avatar/?d=mp&f=y)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></div>
      {message ? <span>{message}</span> : ""}
      <form onSubmit={onSubmit} encType='multipart/form-data'>
        <label htmlFor='avatar'>프로필 사진 변경</label>
        <input
          type='file'
          name='avatar'
          id='avatar'
          accept='image/*'
          onChange={(event) => onFileChanges(event)}
        />
        <label htmlFor='username'>사용자 이름</label>
        <input
          name='username'
          type='text'
          id='username'
          onChange={(e) => updateForm({ username: e.target.value })}
          value={form.username}
        />
        <label htmlFor='intro'>상태메세지</label>
        <input
          name='intro'
          type='text'
          id='intro'
          onChange={(e) => updateForm({ intro: e.target.value })}
          value={form.intro}
        />
        <input type='submit' value={"저장"} />
      </form>
      {!profile.user?.social ? (
        <Link to={"/users/change-password"}>비밀번호 변경</Link>
      ) : (
        ""
      )}
    </>
  );
}

export default EditProfile;
