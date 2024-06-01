import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface IData {
  text: string;
  hashtags: string;
  _id: string;
}

function Home() {
  const navigate = useNavigate();
  async function deletePost(id: any) {
    await fetch(`http://localhost:5050/posts/${id}/delete`);
    const newPost = posts.filter((el) => el._id !== id);
    setPosts(newPost);
  }
  const [posts, setPosts] = useState<IData[]>([]);
  useEffect(() => {
    async function getPosts() {
      const response = await fetch("http://localhost:5050");
      if (!response.ok) {
        const message = `An Error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const posts = await response.json();
      setPosts(posts);
    }
    getPosts();
    return;
  }, [posts.length]);
  return (
    <>
      <h1>Home!</h1>{" "}
      <div>
        {posts?.map((post, index) => (
          <div key={index}>
            <h1>{post.text}</h1>
            <h1>{post.hashtags}</h1>
            <button>
              <Link to={`posts/${post._id}/edit`}>Edit</Link>
            </button>
            <button onClick={() => deletePost(post._id)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
}
export default Home;
