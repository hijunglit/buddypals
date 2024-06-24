import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../atoms/atom";
import axios from "axios";

function Upload() {
  const profile = useRecoilValue(authAtom);
  const [form, setForm] = useState({
    photos: [],
    text: "",
    hashtags: "",
  });
  const [isNew, setIsNew] = useState(true);
  const [preview, setPreview] = useState<string[]>([]);
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
    const formData = new FormData();
    formData.append("photos", form.photos as any);
    formData.append("description", form.text);
    formData.append("hashtags", form.hashtags);
    formData.append("profile", JSON.stringify(profile.user));
    try {
      let response;
      let result;
      if (isNew) {
        response = await axios.post(
          `http://localhost:5050/posts/upload`,
          formData
        );
        result = await response.data;
      }
      if (response?.status !== 200) {
        throw new Error(`HTTP error! status: ${response?.statusText}`);
      }
    } catch (err) {
      console.error(`HTTP error! status: ${err}`);
    } finally {
      setForm({ photos: [], text: "", hashtags: "" });
      navigate("/");
    }
  };
  const handleAddPhotos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const imgLists = target.files as FileList;
    let imgUrlLists: string[] = [...preview];
    console.log(imgUrlLists);
    for (let i = 0; i < imgLists.length; i++) {
      const currentImgUrl = URL.createObjectURL(imgLists[i]);
      imgUrlLists.push(currentImgUrl);
    }
    if (imgUrlLists.length > 3) {
      imgUrlLists = imgUrlLists.slice(0, 3);
    }
    setPreview(imgUrlLists);
    updateForm({ photos: imgLists });
  };
  console.log(form.photos);

  const handleDeletePrevie = (id: any) => {
    setPreview(preview.filter((_, index) => index !== id));
  };
  return (
    <>
      <form onSubmit={onSubmit} encType='multipart/form-data'>
        <label htmlFor='photos'>사진 업로드</label>
        <input
          type='file'
          name='photos'
          id='photos'
          accept='image/*'
          multiple
          onChange={handleAddPhotos}
        />
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
      {preview.map((image, id) => (
        <div key={id} style={{ width: "100px" }}>
          <img src={image} alt={`${image}-${id}`} style={{ width: "100%" }} />
          <span
            onClick={() => handleDeletePrevie(id)}
            style={{ cursor: "pointer" }}
          >
            ❌
          </span>
        </div>
      ))}
    </>
  );
}

export default Upload;
