import { useEffect } from "react";
import { useParams } from "react-router-dom";

function Post() {
  const params = useParams();
  const { id } = params;
  console.log(id);
  useEffect(() => {
    (async () => {
      const response = await fetch(`http://localhost:5050/posts/${id}`);
      const result = await response.json();
      console.log(result);
    })();
  }, []);
  return <h1>post!</h1>;
}

export default Post;
