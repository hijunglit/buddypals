import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../atoms/atom";

interface IPost {
  text: string;
  hashtags: string[];
}

function EditPost() {
  const profile = useRecoilValue(authAtom);
  const [form, setForm] = useState<IPost>({
    text: "",
    hashtags: [""],
  });
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString();
      if (!id) return;
      const response = await fetch(
        `http://localhost:5050/posts/${params.id?.toString()}/edit`
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
      setForm(post);
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
        `http://localhost:5050/posts/${params.id?.toString()}/edit`,
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
      setForm({ text: "", hashtags: [""] });
      navigate(`/`);
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        type='text'
        name='text'
        id='text'
        value={form?.text}
        onChange={(e) => updateForm({ text: e.target.value })}
      />
      <input
        type='text'
        name='hashtags'
        id='hashtags'
        value={form?.hashtags}
        onChange={(e) => updateForm({ hashtags: e.target.value })}
      />
      <input type='submit' value='Edit post' />
    </form>
  );
}

export default EditPost;
