import { useRecoilState } from "recoil";
import { authAtom } from "../atoms/atom";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { formToJSON } from "axios";

function EditProfile() {
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useRecoilState(authAtom);
  console.log(profile);
  const [form, setForm] = useState({
    thumbnailImage: profile.user?.thumbnailImage || "",
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
    const formData = new FormData();
    formData.append("avatar", form.thumbnailImage);
    formData.append("username", String(profile.user?.username));
    formData.append("intro", String(profile.user?.intro));
    formData.append("profile", JSON.stringify(profile.user));
    try {
      const response = await axios.post(
        "http://localhost:5050/users/profile/edit",
        formData
      );
      const result = await response.data;
      console.log(response);
      console.log(result);
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
            thumbnailImage: String(result.user.thumbnailImageUrl),
          },
          isAuthenticated: profile.isAuthenticated,
        });
        return setMessage(result.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setForm({
        thumbnailImage: profile.user?.thumbnailImage || "",
        username: profile.user?.username || "",
        intro: profile.user?.intro || "",
      });
    }
  };
  const handlePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const files = (target.files as FileList)[0];
    updateForm({ thumbnailImage: files });
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
          backgroundImage: profile.user?.thumbnailImage
            ? `url(http://localhost:5050/${profile.user?.thumbnailImage})`
            : "url(https://www.gravatar.com/avatar/?d=mp&f=y)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></div>
      {message ? <span>{message}</span> : ""}
      <form encType='multipart/form-data' onSubmit={onSubmit}>
        <label htmlFor='avatar'>프로필 사진</label>
        <input
          type='file'
          name='avatar'
          id='avatar'
          accept='image/*'
          onChange={handlePhoto}
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
