import { useRecoilState } from "recoil";
import { authAtom } from "../atoms/atom";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { formToJSON } from "axios";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { API_BASE_URL } from "../urls";

const Wrapper = styled.div<{ $isbigscreen: boolean }>`
  width: ${(props) => (props.$isbigscreen ? "50%" : null)};
  margin: ${(props) => (props.$isbigscreen ? "0 auto" : null)};
`;
const ProfileImage = styled.div``;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.625em;
  padding: 1em;
`;
const CustomFileInput = styled.div`
  display: flex;
  gap: 16px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 16px;
`;
const FileName = styled.p``;
const UplodButton = styled.div`
  width: fit-content;
  padding: 8px;
  background-color: #191b27;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;
const Input = styled.input`
  background: transparent;
  border: 1px solid #fff;
  border-radius: 12px;
  padding: 12px;
  color: #fff;
`;
const EditProfileImage = styled.label``;
const UserName = styled.label``;
const StatusMessage = styled.label``;
const SaveButton = styled.input`
  background: transparent;
  border: none;
  color: #0095e7;
  cursor: pointer;
  width: fit-content;
  margin: 0 auto;
  font-weight: 700;
  font-size: 1.25em;
`;

function EditProfile() {
  const isDesktop: boolean = useMediaQuery({ minWidth: 992 });
  const isTablet: boolean = useMediaQuery({
    minWidth: 768,
    maxWidth: 991,
  });
  const isMobile: boolean = useMediaQuery({
    maxWidth: 767,
  });
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useRecoilState(authAtom);
  const userId = profile.user?.id;
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
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
      await fetch(`
        ${API_BASE_URL}/users/${userId}/edit`);
    })();
  }, []);
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("avatar", form.thumbnailImage);
    formData.append("username", String(form.username));
    formData.append("intro", String(form.intro));
    formData.append("profile", JSON.stringify(profile.user));
    try {
      const response = await axios.post(
        `http://localhost:5050/users/${userId}/edit`,
        formData
      );
      const result = await response.data;
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
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onload = () => {
      setPreview(reader.result as string);
      setFileName(files.name);
    };
    updateForm({ thumbnailImage: files });
  };
  return (
    <Wrapper $isbigscreen={isTablet || isDesktop}>
      <h1>프로필 편집</h1>
      <ProfileImage
        style={{
          borderRadius: "50px",
          overflow: "hidden",
          width: "56px",
          height: "56px",
          backgroundImage: preview
            ? `url(${preview})`
            : profile.user?.thumbnailImage.includes("http://")
            ? `url(${profile.user.thumbnailImage})`
            : `url(http://localhost:5050/${profile.user?.thumbnailImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></ProfileImage>
      {message ? <span>{message}</span> : ""}
      <Form encType='multipart/form-data' onSubmit={onSubmit}>
        <EditProfileImage htmlFor='avatar'>
          <CustomFileInput>
            <UplodButton>🔗 FILE UPLOAD</UplodButton>
            {fileName ? <FileName>{fileName}</FileName> : ""}
          </CustomFileInput>
        </EditProfileImage>
        <Input
          type='file'
          name='avatar'
          id='avatar'
          accept='image/*'
          onChange={handlePhoto}
          style={{ display: "none" }}
        />
        <UserName htmlFor='username'>사용자 이름</UserName>
        <Input
          name='username'
          type='text'
          id='username'
          onChange={(e) => updateForm({ username: e.target.value })}
          value={form.username}
        />
        <StatusMessage htmlFor='intro'>상태메세지</StatusMessage>
        <Input
          name='intro'
          type='text'
          id='intro'
          onChange={(e) => updateForm({ intro: e.target.value })}
          value={form.intro}
        />
        <SaveButton type='submit' value={"저장"} />
      </Form>
      {!profile.user?.social ? (
        <Link to={"/users/change-password"}>비밀번호 변경</Link>
      ) : (
        ""
      )}
    </Wrapper>
  );
}

export default EditProfile;
