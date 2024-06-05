import { useEffect } from "react";

function Social() {
  useEffect(() => {
    (async () => {
      await fetch(`http://localhost:5050/users/kakao/start`);
    })();
  }, []);
  return <h1>kakao login</h1>;
}
export default Social;
