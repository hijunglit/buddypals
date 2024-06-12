import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authAtom } from "../atoms/atom";

function Redirection() {
  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(authAtom);
  const code = new URL(document.location.toString()).searchParams.get("code");
  console.log(code);
  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:5050/users/kakao/finish", {
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
        },
        isAuthenticated: true,
      });
      navigate("/");
    })();
  }, []);
  return <h1>kakaotalk Redirection!</h1>;
}

export default Redirection;
