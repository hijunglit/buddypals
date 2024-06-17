import { useRecoilState } from "recoil";
import { authAtom } from "../atoms/atom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useRecoilState(authAtom);
  const [form, setForm] = useState({
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
      await fetch("http://localhost:5050/users/profile/edit");
    })();
  }, []);
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userId = profile.user?.id;
    const profileForm = { ...form };
    const postData = { userId, profileForm };
    try {
      const response = await fetch("http://localhost:5050/users/profile/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const result = await response.json();
      setProfile({
        user: {
          username: String(result.username),
          id: String(result._id),
          social: result.socialOnly,
          intro: result.intro,
        },
        isAuthenticated: profile.isAuthenticated,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setForm({
        username: profile.user?.username || "",
        intro: profile.user?.intro || "",
      });
    }
  };
  return (
    <>
      <h1>Edit Profile!</h1>
      <div
        style={{
          borderRadius: "50px",
          overflow: "hidden",
          width: "100px",
          height: "100px",
          backgroundImage: profile.user?.social
            ? `url(${profile.user?.thumbnailImage})`
            : "url(https://www.gravatar.com/avatar/?d=mp&f=y)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></div>
      <form onSubmit={onSubmit}>
        <label htmlFor='username'>사용자 이름</label>
        <input
          name='username'
          type='text'
          id='username'
          value={form.username}
          onChange={(e) => updateForm({ username: e.target.value })}
        />
        <label htmlFor='intro'>소개</label>
        <input
          name='intro'
          type='text'
          id='intro'
          value={form.intro}
          onChange={(e) => updateForm({ intro: e.target.value })}
        />
        <input type='submit' value={"저장"} />
      </form>
    </>
  );
}

export default EditProfile;
