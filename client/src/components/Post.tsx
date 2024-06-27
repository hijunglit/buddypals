import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface IPostInfo {
  _id: string;
  img: string[];
  text: string;
  hashtags: string[];
  owner: {
    _id: string;
    email: string;
    socialOnly: boolean;
    username: string;
    password: string;
    name: string;
    intro: string;
    salt: string;
    __v: number;
    thumbnailImageUrl: string;
  };
  createdAt: string;
}
function Post() {
  const params = useParams();
  const { id } = params;
  const [post, setPost] = useState<IPostInfo>();
  useEffect(() => {
    (async () => {
      const response = await fetch(`http://localhost:5050/posts/${id}`);
      const result = await response.json();
      const post = result.post;
      setPost(post);
    })();
  }, []);
  return (
    <>
      <h1>Post!</h1>
      <small>Uploaded by {post?.owner.name}</small>
    </>
  );
}

export default Post;
