import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { authAtom } from "../atoms/atom";
import Login from "./Login";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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
const PostTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const OwnerInfo = styled.div`
  display: flex;
  align-items: center;
`;
const OwnerController = styled.div`
  display: "flex";
  height: "80px";
  alignitems: "center";
`;
const Edit = styled.button``;
const Delete = styled.button``;
const SeePost = styled.button``;
const Controller = styled.div``;
const Thumbnail = styled.div<{ $ownerthumb: string }>`
  background-image: url(${(props) => props.$ownerthumb});
  width: 60px !important;
  height: 60px !important;
  background-size: cover;
  background-position: center;
  border-radius: 50px;
`;
const UserName = styled.h3`
  color: #000;
`;
const Text = styled.h1``;

const Photo = styled.div``;
const Hashtags = styled.h1``;

function Home() {
  const profile = useRecoilValue(authAtom);
  async function deletePost(id: any) {
    const response = await fetch(`http://localhost:5050/posts/${id}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });
    if (response.status === 404) {
      return;
    }
    if (response.status === 403) {
      return;
    }
    const newPost = posts.filter((el) => el._id !== id);
    setPosts(newPost);
  }
  const [posts, setPosts] = useState<IPostInfo[]>([]);
  console.log(posts);
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
                <PostTop>
                  <OwnerInfo>
                    <Link to={`users/${post.owner._id}`}>
                      <Thumbnail
                        {...{ $ownerthumb: post.owner.thumbnailImageUrl }}
                      />
                    </Link>
                    <Link to={`users/${post.owner._id}`}>
                      <UserName>{post.owner.username}</UserName>
                    </Link>
                  </OwnerInfo>
                  <Controller>
                    {String(post.owner._id) === String(profile.user?.id) ? (
                      <>
                        <OwnerController>
                          <Edit>
                            <Link to={`posts/${post._id}/edit`}>수정</Link>
                          </Edit>
                          <Delete onClick={() => deletePost(post._id)}>
                            삭제
                          </Delete>
                        </OwnerController>
                        <SeePost>
                          <Link to={`posts/${post._id}`}>게시물 보기</Link>
                        </SeePost>
                      </>
                    ) : (
                      <SeePost>
                        <Link to={`posts/${post._id}`}>게시물 보기</Link>
                      </SeePost>
                    )}
                  </Controller>
                </PostTop>
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
                        width: "500px",
                        height: "500px",
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
