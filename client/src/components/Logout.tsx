import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authAtom } from "../atoms/atom";

function Logout() {
  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(authAtom);
  useEffect(() => {
    (async () => {
      await fetch("http://localhost:5050/users/logout", {});
    })();
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
    navigate("/");
  }, []);
  return <h1>Logout</h1>;
}
export default Logout;
