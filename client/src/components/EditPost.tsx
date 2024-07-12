import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../atoms/atom";
import { API_BASE_URL } from "../urls";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";

interface IPost {
  text: string;
  hashtags: string;
}
const EditForm = styled.form<{ $isbigscreen: boolean }>`
  display: flex;
  width: ${(props) => (props.$isbigscreen ? "50%" : null)};
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
const SubmitEdit = styled.input`
  background: transparent;
  border: none;
  color: #0095e7;
  cursor: pointer;
  width: fit-content;
  margin: 0 auto;
  font-weight: 700;
  font-size: 1.25em;
`;

function EditPost() {
  const isDesktop: boolean = useMediaQuery({ minWidth: 992 });
  const isTablet: boolean = useMediaQuery({
    minWidth: 768,
    maxWidth: 991,
  });
  const isMobile: boolean = useMediaQuery({
    maxWidth: 767,
  });
  const profile = useRecoilValue(authAtom);
  const [form, setForm] = useState<IPost>({
    text: "",
    hashtags: "",
  });
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString();
      if (!id) return;
      const response = await fetch(
        `${API_BASE_URL}/posts/${params.id?.toString()}/edit`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const post = await response.json();
      if (!post) {
        console.warn(`Post with id ${id} not found`);
        navigate("/");
        return;
      }
      if (profile.user?.id !== post.owner) {
        navigate("/");
      }
      const { hashtags, ...otherData } = post;
      const stringifiedKey = Array.isArray(hashtags)
        ? hashtags.join()
        : hashtags;
      const processedData = { ...otherData, hashtags: stringifiedKey };
      setForm(processedData);
      console.log(form);
    }
    fetchData();
  }, [params.id, navigate]);
  function updateForm(value: any) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const post = { ...form };
    const user = profile.user;
    try {
      let response;
      response = await fetch(
        `${API_BASE_URL}/posts/${params.id?.toString()}/edit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ post, user }),
        }
      );
      if (response.status === 403) {
        navigate("/");
      }
    } catch (err) {
      console.error("A problem occurred with your fetch operation: ", err);
    } finally {
      setForm({ text: "", hashtags: "" });
      navigate(`/`);
    }
  };
  return (
    <EditForm onSubmit={onSubmit} $isbigscreen={isTablet || isDesktop}>
      <Input
        type='text'
        name='text'
        id='text'
        value={form?.text}
        onChange={(e) => updateForm({ text: e.target.value })}
      />
      <Input
        type='text'
        name='hashtags'
        id='hashtags'
        value={form?.hashtags}
        onChange={(e) => updateForm({ hashtags: e.target.value })}
      />
      <SubmitEdit type='submit' value='완료' />
    </EditForm>
  );
}

export default EditPost;
