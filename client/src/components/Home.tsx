import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { authAtom } from "../atoms/atom";
import Login from "./Login";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const PostContainer = styled.div``;
const Post = styled.div`
  width: fit-content;
  margin: 0 auto;
  padding: 12px 16px;
  & a {
    color: #fff;
    text-decoration: none;
  }
`;
const Text = styled.h1``;

const Photo = styled.div``;
const Hashtags = styled.h1``;

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

interface IData {
  text: string;
  hashtags: string;
  _id: string;
  img: string[];
}

function Home() {
  const authState = useRecoilValue(authAtom);
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
      const json = await response.json();
      const posts = json.posts;
      setPosts(posts);
    }
    getPosts();
    return;
  }, [posts.length]);

  return (
    <>
      {authState.isAuthenticated ? (
        <>
          <h1 style={{ textAlign: "center" }}>
            Welcome! {authState.user?.username}!
          </h1>
          <PostContainer>
            {posts?.map((post, index) => (
              <Post key={index} style={{ width: "500px", height: "500px" }}>
                <Text>{post.text}</Text>

                <Hashtags>{post.hashtags}</Hashtags>
                <button>
                  <Link to={`posts/${post._id}/edit`}>Edit</Link>
                </button>
                <button onClick={() => deletePost(post._id)}>Delete</button>
              </Post>
            ))}
          </PostContainer>
        </>
      ) : (
        <Login />
      )}
    </>
  );
}
export default Home;
