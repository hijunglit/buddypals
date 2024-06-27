import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../atoms/atom";
import axios from "axios";
import styled from "styled-components";

const UploadForm = styled.form``;
const CustomFileInput = styled.div`
  display: flex;
  gap: 16px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 16px;
  width: 200px;
`;
const UploadButton = styled.div`
  width: fit-content;
  padding: 16px;
  background-color: #191b27;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;
const FileName = styled.p``;

function Upload() {
  const profile = useRecoilValue(authAtom);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    photos: [],
    text: "",
    hashtags: "",
  });
  const [preview, setPreview] = useState<string[]>([]);
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
    if (fileName.length === 0) {
      return setMessage("사진을 선택해주세요.");
    }
    const formData = new FormData();
    for (let i = 0; i < form.photos.length; i++) {
      formData.append("photos", form.photos[i]);
    }
    formData.append("photos", form.photos as any);
    formData.append("text", form.text);
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
    for (let i = 0; i < imgLists.length; i++) {
      const currentImgUrl = URL.createObjectURL(imgLists[i]);
      imgUrlLists.push(currentImgUrl);
    }
    if (imgUrlLists.length > 3) {
      imgUrlLists = imgUrlLists.slice(0, 3);
    }
    setPreview(imgUrlLists);
    setFileName(imgLists[0].name);
    updateForm({ photos: imgLists });
  };
  console.log(fileName);
  const handleDeletePrevie = (id: any) => {
    setPreview(preview.filter((_, index) => index !== id));
  };
  return (
    <>
      <UploadForm onSubmit={onSubmit} encType='multipart/form-data'>
        <label htmlFor='photos'>
          <CustomFileInput>
            <UploadButton>🔗 FILE UPLOAD</UploadButton>
            {fileName ? <FileName>{fileName}</FileName> : ""}
          </CustomFileInput>
        </label>
        <input
          type='file'
          name='photos'
          id='photos'
          accept='image/*'
          multiple
          onChange={handleAddPhotos}
          style={{ display: "none" }}
          required
        />
        <input
          placeholder='텍스트'
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
      </UploadForm>
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
