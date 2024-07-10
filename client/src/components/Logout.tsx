import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authAtom } from "../atoms/atom";
import { API_BASE_URL } from "../urls";

function Logout() {
  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(authAtom);
  useEffect(() => {
    (async () => {
      await fetch(`${API_BASE_URL}/users/logout`, {});
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
