import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

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
const Hashtags = styled.h1``;

interface IData {
  text: string;
  hashtags: string;
  _id: string;
}

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cookies, setCoolie, removeCookie] = useCookies(["id"]);
  const [userId, SetUserId] = useState(null);
  const navigate = useNavigate();
  // const authCheck = async () => {
  //   const token = cookies.id;
  //   await fetch(`http://localhost:5050/users/loginCheck`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(token),
  //   }).then((res) => {
  //     SetUserId(res.token);
  //     setIsLoggedIn(true);
  //   }).catch(() => {
  //     logOut();
  //   });
  // };
  // useEffect(() => {
  //   authCheck();
  // });
  // const logOut = () => {
  //   removeCookie('id');
  // }
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
      {isLoggedIn ? (
        <>
          <h1 style={{ textAlign: "center" }}>Home!</h1>
          <PostContainer>
            {posts?.map((post, index) => (
              <Post key={index}>
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
        <h1>You have to log in </h1>
      )}
    </>
  );
}
export default Home;
