import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Upload() {
  const [form, setForm] = useState({
    text: "",
    hashtags: "",
  });
  const [isNew, setIsNew] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const getUpload = fetch(`http://localhost:5050/posts/upload`);
  }, []);

  function updateForm(value: any) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }
  const onSubmit = async (e: any) => {
    e.preventDefault();
    const post = { ...form };
    try {
      let response;
      if (isNew) {
        response = await fetch("http://localhost:5050/posts/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(post),
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
