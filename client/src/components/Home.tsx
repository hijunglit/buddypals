import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { authAtom } from "../atoms/atom";
import Login from "./Login";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useMediaQuery } from "react-responsive";

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

const PostContainer = styled.div<{ $isbigscreen: boolean }>`
  width: ${(props) => (props.$isbigscreen ? "468px" : "100%")};
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;
const Post = styled.div<{ $isbigscreen: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0 auto;
  width: 100%;
  padding: 12px 0px;
  & a {
    color: #fff;
    text-decoration: none;
  }
  &:last-child {
    margin-bottom: 100px;
  }
`;
const PostTop = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0px 8px;
`;
const PostBottom = styled.div`
  padding: 0 8px;
`;
const OwnerInfo = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;
const OwnerController = styled.div`
  display: "flex";
  height: "80px";
  alignitems: "center";
`;
const Edit = styled.button`
  background: transparent;
  border: 1px solid #fff;
  border-radius: 6px;
`;
const Delete = styled.button`
  background: transparent;
  border: 1px solid #fff;
  border-radius: 6px;
  color: #fff;
`;
const SeePost = styled.button`
  background: transparent;
  border: 1px solid #fff;
  border-radius: 6px;
`;
const Controller = styled.div`
  display: flex;
`;
const Thumbnail = styled.div<{ $ownerthumb: string }>`
  width: 32px;
  height: 32px;
  background-image: url(${(props) => props.$ownerthumb});
  background-size: cover;
  background-position: center;
  border-radius: 50px;
`;
const UserName = styled.h3`
  color: #000;
`;
const Text = styled.h1``;

const Photo = styled.div`
  height: 400px;
`;
const Hashtags = styled.h1``;

function Home(): JSX.Element {
  const isDesktop: boolean = useMediaQuery({ minWidth: 992 });
  const isTablet: boolean = useMediaQuery({
    minWidth: 768,
    maxWidth: 991,
  });
  const isMobile: boolean = useMediaQuery({
    maxWidth: 767,
  });
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
          <PostContainer $isbigscreen={isTablet || isDesktop}>
            {posts?.map((post) => (
              <Post key={post._id} $isbigscreen={isTablet || isDesktop}>
                <PostTop>
                  <OwnerInfo>
                    <Link to={`users/${post.owner._id}`}>
                      <Thumbnail
                        {...{
                          $ownerthumb: post.owner.thumbnailImageUrl.includes(
                            "http://"
                          )
                            ? post.owner.thumbnailImageUrl
                            : `http://localhost:5050/${post.owner.thumbnailImageUrl}`,
                        }}
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
                      }}
                    />
                  ))}
                </Carousel>
                <PostBottom>
                  <Text>{post.text}</Text>
                  <Hashtags>{post.hashtags}</Hashtags>
                </PostBottom>
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
