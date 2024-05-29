import { useEffect } from "react";
import { useParams } from "react-router-dom";

function Post() {
  let { id } = useParams() as any;
  console.log(id);
  useEffect(() => {
    const fetchPostData = fetch(`http://localhost:5050/${id}`);
  }, []);
  return <h1>Post: {id}</h1>;
}

export default Post;
