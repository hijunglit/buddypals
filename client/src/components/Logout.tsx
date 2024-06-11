import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      await fetch("http://localhost:5050/users/logout");
      localStorage.removeItem("persist:root");
      navigate("/");
    })();
  }, []);
  return <h1>Logout</h1>;
}
export default Logout;
