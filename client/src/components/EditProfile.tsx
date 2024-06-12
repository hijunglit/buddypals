import { useRecoilState } from "recoil";
import { authAtom } from "../atoms/atom";
import { useState } from "react";

function EditProfile() {
  const [profile, setProfile] = useRecoilState(authAtom);
  const [form, setForm] = useState({
    username: profile.user?.username,
    intro: "",
  });
  function updateForm(value: any) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }
  console.log(profile);
  return (
    <>
      <h1>Edit Profile!</h1>
      <div
        style={{
          borderRadius: "50px",
          overflow: "hidden",
          width: "100px",
          height: "100px",
          backgroundImage: `url(${profile.user?.thumbnailImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></div>
      <form>
        <label htmlFor='username'>사용자 이름</label>
        <input
          name='username'
          type='text'
          id='username'
          value={form.username || ""}
          onChange={(e) => updateForm({ username: e.target.value })}
        />
        <label htmlFor='intro'>소개</label>
        <input
          name='intro'
          type='text'
          id='intro'
          value={""}
          onChange={(e) => updateForm({ intro: e.target.value })}
        />
      </form>
    </>
  );
}

export default EditProfile;
