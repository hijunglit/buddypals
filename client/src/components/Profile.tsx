import { useEffect } from "react";
import { Link } from "react-router-dom";

function Profile() {
  useEffect(() => {
    (async () => {
      await fetch("http://localhost:5050/users/profile");
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
