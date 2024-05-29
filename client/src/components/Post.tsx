import { useEffect } from "react";

function Post() {
  useEffect(() => {
    const fetchPostData = fetch(`http://localhost:5050/posts/see`);
  }, []);
  return <h1>Post</h1>;
}

export default Post;
