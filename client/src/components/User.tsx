import { useEffect } from "react";

function User() {
  useEffect(() => {
    const getUserData = fetch(`http://localhost:5050/users/edit`);
  }, []);
  return (
    <>
      <h1>Edit User</h1>
      <div>
        <h1>hey</h1>
      </div>
    </>
  );
}
export default User;
