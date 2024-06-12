import { Link } from "react-router-dom";

function Profile() {
  return (
    <>
      <h1>User Profile</h1>
      <Link to={"edit"}>프로필 편집</Link>
    </>
  );
}

export default Profile;
