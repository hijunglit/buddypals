import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:5050/login");
      const json = await response.json();
      console.log(json);
    })();
  }, []);
  const onSubmit = () => {
    console.log("post login");
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input type='text' placeholder='사용자 이름' name='username' required />
        <input
          type='password'
          placeholder='비밀번호'
          name='password'
          autoComplete='off'
          required
        />
        <input type='submit' value={"로그인"} />
      </form>
      <hr />
      <div>
        <Link to={"/join"}>새 계정 만들기 &rarr;</Link>
      </div>
    </>
  );
}

export default Login;
