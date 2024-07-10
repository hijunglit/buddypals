import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authAtom } from "./atoms/atom";
import { API_BASE_URL } from "./urls";

function Redirection() {
  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(authAtom);
  const code = new URL(document.location.toString()).searchParams.get("code");
  useEffect(() => {
    (async () => {
      const response = await fetch(`${API_BASE_URL}/users/kakao/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code }),
      });
      const result = await response.json();
      setAuthState({
        user: {
          username: String(result.user.username),
          id: String(result.user.userId),
          profileImage: String(result.user.profileImage),
          thumbnailImage: String(result.user.thumbnailImage),
          social: true,
          intro: "",
        },
        isAuthenticated: true,
      });
      navigate("/");
    })();
  }, []);
  return <h1>kakaotalk Redirection!</h1>;
}

export default Redirection;
