import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../atoms/atom";

function Upload() {
  const profile = useRecoilValue(authAtom);
  const [form, setForm] = useState({
    text: "",
    hashtags: "",
  });
  const [isNew, setIsNew] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const response = await fetch(`http://localhost:5050/posts/upload`);
      const result = await response.json();
      console.log(result);
    })();
  }, []);

  function updateForm(value: any) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }
  const onSubmit = async (e: any) => {
    e.preventDefault();
    const post = { ...form };
    const postData = { post, profile };
    try {
      let response;
      if (isNew) {
        response = await fetch("http://localhost:5050/posts/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
      }
      if (!response?.ok) {
        throw new Error(`HTTP error! status: ${response?.statusText}`);
      }
    } catch (err) {
      console.error(`HTTP error! status: ${err}`);
    } finally {
      setForm({ text: "", hashtags: "" });
      navigate("/");
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        placeholder='Description'
        type='text'
        name='text'
        value={form.text}
        onChange={(e) => updateForm({ text: e.target.value })}
        required
      />
      <input
        placeholder='Hashtags'
        type='text'
        name='hashtags'
        value={form.hashtags}
        onChange={(e) =>
          updateForm({
            hashtags: e.target.value,
          })
        }
        required
      />
      <input type='submit' value='Upload Post' />
    </form>
  );
}

export default Upload;
