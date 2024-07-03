import { useEffect, useLayoutEffect, useState } from "react";
import { Link, PathMatch, useMatch, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { authAtom } from "../atoms/atom";
import Login from "./Login";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useMediaQuery } from "react-responsive";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion, useScroll } from "framer-motion";

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
const Post = styled(motion.div)<{ $isbigscreen: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  display: flex;
  flex-direction: column;
  row-gap: 6px;
`;
const OwnerInfo = styled.div`
  height: 100%;
  display: flex;
  column-gap: 8px;
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
const UserName = styled.h3``;

const Photo = styled.div`
  height: 468px;
`;
const More = styled.div``;
const Comment = styled.div`
  width: fit-content;
  cursor: pointer;
`;
const Text = styled.h1``;
const Hashtags = styled.h1`
  color: #e0f1ff;
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 99;
`;
const PostModal = styled(motion.div)`
  position: absolute;
  display: flex;
  column-gap: 16px;
  width: 80vw;
  height: 96vh;
  background-color: ${(props) => props.theme.bgColor};
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 9999;
`;
const ModalPhotos = styled.div`
  width: 60%;
`;
const ModalPohto = styled.div``;
const PostDetail = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
`;
const DetailTop = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;
  font-weight: 700;
  border-bottom: 1px solid #262626;
  line-height: 4;
`;
const DetailBody = styled.div``;
const DetailBottom = styled.div``;
const OwnerThumb = styled.div<{ $ownerthumb: string }>`
  background-image: url(${(props) => props.$ownerthumb});
  background-size: cover;
  background-position: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;
const OwnerName = styled.h5``;
const PostText = styled.p``;
const CommentSection = styled.div``;

function Home(): JSX.Element {
  const history = useNavigate();
  const postMatch: PathMatch<string> | null = useMatch("/post/:postId");
  const { scrollY } = useScroll();
  const scrollyValue = scrollY.get();
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
  useLayoutEffect(() => {
    if (sessionStorage.getItem("homeCoordinate") === undefined) {
      return;
    }
    return window.scroll(0, sessionStorage.homeCoordinate);
  });
  useEffect(() => {
    window.addEventListener("pagehide", clearHomeCoordinate);
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
    return () => window.removeEventListener("pagehide", clearHomeCoordinate);
  }, [posts.length]);
  const onCommentClickedOnMobile = (postId: string) => {
    history(`/post/${postId}/comments`);
  };
  const onCommentClickedOnBigScreen = (postId: string) => {
    history(`/post/${postId}`);
    const currentScrollY = window.scrollY;
    sessionStorage.setItem("homeCoordinate", String(currentScrollY));
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${currentScrollY}px`;
    document.body.style.overflowY = "scroll";
  };
  const onOverlayClick = () => {
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.top = "";
    document.body.style.overflowY = "";
    history("/");
  };
  const clickedPost =
    postMatch?.params.postId &&
    posts.find((post) => post._id === postMatch.params.postId);
  const clearHomeCoordinate = () => {
    sessionStorage.removeItem("homeCoordinate");
  };
  return (
    <>
      {profile.isAuthenticated ? (
        <>
          <PostContainer $isbigscreen={isTablet || isDesktop}>
            {posts?.map((post) => (
              <Post
                layoutId={post._id}
                key={post._id}
                $isbigscreen={isTablet || isDesktop}
              >
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
                          <Link to={`/posts/${post._id}`}>게시물로 이동</Link>
                        </SeePost>
                      </>
                    ) : (
                      <SeePost>
                        <Link to={`/posts/${post._id}`}>게시물로 이동</Link>
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
                  <More>
                    {isMobile && (
                      <Comment
                        onClick={() => onCommentClickedOnMobile(post._id)}
                      >
                        <FontAwesomeIcon icon={faComment} size={"xl"} />
                      </Comment>
                    )}
                    {isTablet ||
                      (isDesktop && (
                        <Comment
                          onClick={() => onCommentClickedOnBigScreen(post._id)}
                        >
                          <FontAwesomeIcon icon={faComment} size={"xl"} />
                        </Comment>
                      ))}
                  </More>
                  <Text>{post.text}</Text>
                  <Hashtags>{post.hashtags}</Hashtags>
                </PostBottom>
              </Post>
            ))}
            <AnimatePresence>
              {postMatch ? (
                <>
                  <Overlay
                    onClick={onOverlayClick}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                  <PostModal style={{ top: scrollY.get() + 30 }}>
                    {clickedPost && (
                      <>
                        <ModalPhotos>
                          <Carousel
                            responsive={responsive}
                            showDots={true}
                            infinite={true}
                          >
                            {clickedPost.img.map((photo) => (
                              <ModalPohto
                                key={`modalphoto:${photo}`}
                                style={{
                                  background: `url(http://localhost:5050/${photo})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  width: "100%",
                                  height: "90vh",
                                }}
                              />
                            ))}
                          </Carousel>
                        </ModalPhotos>
                        <PostDetail>
                          <DetailTop>
                            <Link to={`/users/${clickedPost.owner._id}`}>
                              <OwnerThumb
                                $ownerthumb={
                                  clickedPost.owner.thumbnailImageUrl.includes(
                                    "http"
                                  )
                                    ? clickedPost.owner.thumbnailImageUrl
                                    : `http://localhost:5050/${clickedPost.owner.thumbnailImageUrl}`
                                }
                              />
                            </Link>
                            <Link to={`/users/${clickedPost.owner._id}`}>
                              <OwnerName>
                                {clickedPost.owner.username}
                              </OwnerName>
                            </Link>
                          </DetailTop>
                          <DetailBody>
                            <PostText>{clickedPost.text}</PostText>
                            <Hashtags>{clickedPost.hashtags}</Hashtags>
                            <CommentSection></CommentSection>
                          </DetailBody>
                          <DetailBottom></DetailBottom>
                        </PostDetail>
                      </>
                    )}
                  </PostModal>
                </>
              ) : null}
            </AnimatePresence>
          </PostContainer>
        </>
      ) : (
        <Login />
      )}
    </>
  );
}
export default Home;
