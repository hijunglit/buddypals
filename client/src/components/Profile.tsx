import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../atoms/atom";

function Profile() {
  const profile = useRecoilValue(authAtom);
  const userId = profile.user?.id;
  const [message, setMessage] = useState("");
  useEffect(() => {
    (async () => {
      const response = await fetch(`http://localhost:5050/users/${userId}`);
      const result = await response.json();
    })();
  }, []);
  return (
    <>
      <h1>User Profile</h1>
      <Link to={"edit"}>프로필 편집</Link>
    </>
  );
}

export default Profile;
