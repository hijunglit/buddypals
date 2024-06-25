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
  & div {
    width: 500px;
    height: 600px;
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
  _id: string;
  img: string[];
  text: string;
  hashtags: string;
  owner: string;
}

function Home() {
  const profile = useRecoilValue(authAtom);
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
      {profile.isAuthenticated ? (
        <>
          <PostContainer>
            {posts?.map((post) => (
              <Post key={post._id} style={{ width: "500px" }}>
                {String(post.owner) === String(profile.user?.id) ? (
                  <div
                    style={{
                      display: "flex",
                      height: "80px",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ height: "80px" }}>
                      <button>
                        <Link to={`posts/${post._id}/edit`}>수정</Link>
                      </button>
                      <button onClick={() => deletePost(post._id)}>삭제</button>
                    </div>
                    <button>
                      <Link to={`posts/${post._id}`}>게시물 보기</Link>
                    </button>
                  </div>
                ) : (
                  <button>
                    <Link to={`posts/${post._id}`}>게시물 보기</Link>
                  </button>
                )}
                <Carousel
                  responsive={responsive}
                  showDots={true}
                  infinite={true}
                >
                  {post.img.map((img) => (
                    <Photo
                      key={img}
                      style={{
                        background: `url(http://localhost:5050/${img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ))}
                </Carousel>
                <Text>{post.text}</Text>
                <Hashtags>{post.hashtags}</Hashtags>
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
