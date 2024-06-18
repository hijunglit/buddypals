import { useRecoilState } from "recoil";
import { authAtom } from "../atoms/atom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useRecoilState(authAtom);
  console.log("profile: ", profile);
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
    const profileForm = { ...form };
    const postData = { profileForm, profile };
    try {
      const response = await fetch("http://localhost:5050/users/profile/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const result = await response.json();
      console.log(response, result);
      if (response.status === 400) {
        return setMessage(result.message);
      }
      if (response.status === 200) {
        return setMessage("");
      }
      if (response.status === 201) {
        setProfile({
          user: {
            username: String(result.user.username),
            id: String(profile.user?.id),
            social: Boolean(profile.user?.social),
            intro: String(result.user.intro),
          },
          isAuthenticated: profile.isAuthenticated,
        });
        return setMessage(result.message);
      }
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
      {message ? <span>{message}</span> : ""}
      <form onSubmit={onSubmit}>
        <label htmlFor='username'>사용자 이름</label>
        <input
          name='username'
          type='text'
          id='username'
          onChange={(e) => updateForm({ username: e.target.value })}
          value={form.username}
        />
        <label htmlFor='intro'>상태메세지</label>
        <input
          name='intro'
          type='text'
          id='intro'
          onChange={(e) => updateForm({ intro: e.target.value })}
          value={form.intro}
        />
        <input type='submit' value={"저장"} />
      </form>
    </>
  );
}

export default EditProfile;
