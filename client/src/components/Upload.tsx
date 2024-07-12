import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../atoms/atom";
import axios from "axios";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { API_BASE_URL } from "../urls";

const UploadForm = styled.form<{ $isbigscreen: boolean }>`
  display: flex;
  width: ${(props) => (props.$isbigscreen ? "50%" : null)};
  flex-direction: column;
  gap: 0.625em;
  padding: 1em;
  margin: ${(props) => (props.$isbigscreen ? "0 auto" : null)};
`;
const CustomFileInput = styled.div`
  display: flex;
  gap: 16px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 16px;
`;
const UploadButton = styled.div`
  width: fit-content;
  padding: 8px;
  background-color: #191b27;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;
const FileName = styled.p``;
const Input = styled.input`
  background: transparent;
  border: 1px solid #fff;
  border-radius: 12px;
  padding: 12px;
  color: #fff;
`;
const UploadPost = styled.input`
  background: transparent;
  border: none;
  color: #0095e7;
  cursor: pointer;
  width: fit-content;
  margin: 0 auto;
  font-weight: 700;
  font-size: 1.25em;
`;
const PreviewBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 2px;
`;
const Preview = styled.div`
  position: relative;
`;
const Img = styled.img`
  width: 100px;
`;
const Cancel = styled.span`
  position: absolute;
  right: 0;
`;

function Upload() {
  const isDesktop: boolean = useMediaQuery({ minWidth: 992 });
  const isTablet: boolean = useMediaQuery({
    minWidth: 768,
    maxWidth: 991,
  });
  const isMobile: boolean = useMediaQuery({
    maxWidth: 767,
  });
  const profile = useRecoilValue(authAtom);
  const [fileName, setFileName] = useState("");
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
      const response = await fetch(`${API_BASE_URL}/posts/upload`);
      const result = await response.json();
    })();
  }, []);
  function updateForm(value: any) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }
  const onSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < form.photos.length; i++) {
      formData.append("photos", form.photos[i]);
    }
    formData.append("text", form.text);
    formData.append("hashtags", form.hashtags);
    formData.append("profile", JSON.stringify(profile.user));
    try {
      let response;
      let result;
      if (isNew) {
        response = await axios.post(`${API_BASE_URL}/posts/upload`, formData);
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
  const handleDeletePrevie = (id: any) => {
    setPreview(preview.filter((_, index) => index !== id));
  };
  return (
    <>
      <UploadForm
        onSubmit={onSubmit}
        encType='multipart/form-data'
        $isbigscreen={isTablet || isDesktop}
      >
        <label htmlFor='photos'>
          <CustomFileInput>
            <UploadButton>🔗 FILE UPLOAD</UploadButton>
            {fileName ? (
              <FileName>{fileName}</FileName>
            ) : (
              "최대 3장까지 업로드 할 수 있습니다."
            )}
          </CustomFileInput>
        </label>
        <Input
          type='file'
          name='photos'
          id='photos'
          accept='image/*'
          multiple
          onChange={handleAddPhotos}
          style={{ display: "none" }}
          required
        />
        <Input
          placeholder='텍스트'
          type='text'
          name='text'
          value={form.text}
          onChange={(e) => updateForm({ text: e.target.value })}
          required
        />
        <Input
          placeholder='해시태그(콤마,)로 구분해 주세요. ex) hash,tag'
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
        <UploadPost type='submit' value='게시하기' />
      </UploadForm>
      <PreviewBox>
        {preview.map((image, id) => (
          <Preview key={id} style={{ width: "100px" }}>
            <Img src={image} alt={`${image}-${id}`} />
            {/* <Cancel
              onClick={() => handleDeletePrevie(id)}
              style={{ cursor: "pointer" }}
            >
              ❌
            </Cancel> */}
          </Preview>
        ))}
      </PreviewBox>
    </>
  );
}

export default Upload;
