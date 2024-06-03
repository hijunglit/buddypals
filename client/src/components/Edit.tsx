import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface IPost {
  text: string;
  hashtags: string[];
}

function Edit() {
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
    try {
      let response;
      response = await fetch(
        `http://localhost:5050/posts/${params.id?.toString()}/edit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(post),
        }
      );
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

export default Edit;
