import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Edit() {
  const [post, setPost] = useState();
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString();
      if (!id) return;
      setIsNew(false);
      const response = await fetch(
        `http://localhost:5050/posts/${params.id?.toString()}/edit`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const post = await response.json();
      if (!post) {
        console.warn(`Post with id ${id} not found`);
        navigate("/");
        return;
      }
      setPost(post);
    }
    fetchData();
  }, []);
  return <h1>this is edit page!</h1>;
}

export default Edit;
