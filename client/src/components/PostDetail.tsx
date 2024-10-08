import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRecoilValue } from "recoil";
import { authAtom } from "../atoms/atom";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import { API_BASE_URL } from "../urls";

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

  comments: {
    _id: string;
    text: string;
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
    post: string;
    createdAt: string;
  }[];
  createdAt: string;
}
const Wrapper = styled.div<{ $isbigscreen: boolean }>`
  width: ${(props) => (props.$isbigscreen ? "calc(100% - 80px)" : "100%")};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const Header = styled.header``;
const HeaderTop = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
  height: 44px;
  border-bottom: 2px solid #262626;
  background: #000;
`;
const Goback = styled.div`
  cursor: pointer;
`;
const PageTitle = styled.h1`
  text-align: center;
  font-weight: 700;
  line-height: 3;
`;
const CommentsSection = styled.div<{ $isbigscreen: boolean }>`
  margin-bottom: ${(props) => (props.$isbigscreen ? "80px" : "130px")};
`;
const HeaderBody = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 44px;
  border-bottom: 1px solid #262626;
`;
const FormContainer = styled.div<{ $isbigscreen: boolean }>`
  width: 100%;
  height: 80px;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  bottom: ${(props) => (props.$isbigscreen ? "0px" : "50px")};
  background: #000;
  border-top: 1px solid #262626;
`;

function PostDetail() {
  const isDesktop: boolean = useMediaQuery({ minWidth: 992 });
  const isTablet: boolean = useMediaQuery({
    minWidth: 768,
    maxWidth: 991,
  });
  const isMobile: boolean = useMediaQuery({
    maxWidth: 767,
  });
  const history = useNavigate();
  const params = useParams();
  const profile = useRecoilValue(authAtom);
  const { id } = params;
  const [post, setPost] = useState<IPostInfo>();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`);
      const result = await response.json();
      const post = result.post;
      setPost(post);
    })();
  }, [comments]);
  const onGobackClick = () => history(-1);
  const handleSetValue = (event: any) => {
    setComment(event.target.value);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("text", comment);
    formData.append("profile", JSON.stringify(profile.user));
    const formJson = Object.fromEntries(formData.entries());
    if (comment === "") {
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/post/${post?._id}/comments`,
        formJson
      );
      const result = await response.data;
      if (response.status === 201) {
        setComments((prev) => {
          return { ...prev, comment };
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setComment("");
    }
  };
  return (
    <div style={{ display: "flex", justifyContent: "right" }}>
      <Wrapper $isbigscreen={isTablet || isDesktop}>
        <Header>
          <HeaderTop>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px",
              }}
            >
              <Goback onClick={onGobackClick}>
                <FontAwesomeIcon icon={faChevronLeft} size='xl' />
              </Goback>
              <PageTitle>게시물</PageTitle>
              <div style={{ width: "15px", height: "15px" }}></div>
            </div>
          </HeaderTop>
          <HeaderBody>
            <Link to={`/users/${post?.owner._id}`}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundImage: `url(${
                    post?.owner.thumbnailImageUrl.includes("http")
                      ? post?.owner.thumbnailImageUrl
                      : `${API_BASE_URL}/${post?.owner.thumbnailImageUrl}`
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "50%",
                }}
              ></div>
            </Link>
            <div>
              <div style={{ display: "flex", gap: "6px" }}>
                <Link to={`/users/${post?.owner._id}`}>
                  <h5 style={{ fontWeight: 600 }}>{post?.owner.username}</h5>
                </Link>
                <p style={{ overflowWrap: "anywhere" }}>{post?.text}</p>
              </div>
              <p style={{ color: "#e0f1ff" }}>{post?.hashtags}</p>
              <small style={{ color: "#a8a8a8" }}>
                {new Date().toLocaleDateString("ko-kr", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </small>
            </div>
          </HeaderBody>
        </Header>
        <CommentsSection $isbigscreen={isTablet || isDesktop}>
          <ul style={{ display: "grid", gap: "12px" }}>
            {post?.comments.map((comment) => (
              <li key={comment._id}>
                <div
                  style={{
                    display: "flex",
                    columnGap: "6px",
                  }}
                >
                  <Link to={`/users/${comment.owner._id}`}>
                    <div
                      style={{
                        backgroundImage:
                          comment.owner.thumbnailImageUrl.includes("http")
                            ? `url(${comment.owner.thumbnailImageUrl})`
                            : `url(${API_BASE_URL}/${comment.owner.thumbnailImageUrl})`,
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                  </Link>
                  <div style={{ lineHeight: "1.4" }}>
                    <Link to={`/users/${comment.owner._id}`}>
                      <p style={{ fontWeight: 600 }}>
                        {comment.owner.username}
                      </p>
                    </Link>
                    <p>{comment.text}</p>
                    <small style={{ fontSize: "12px", color: "#a8a8a8" }}>
                      {new Date(comment.createdAt).toLocaleDateString("ko-kr", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </small>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CommentsSection>
        {profile.isAuthenticated && (
          <FormContainer $isbigscreen={isTablet || isDesktop}>
            <form onSubmit={handleSubmit} style={{ display: "flex" }}>
              <textarea
                style={{
                  resize: "none",
                  background: "#000",
                  border: "none",
                  color: "#fff",
                }}
                name='text'
                cols={50}
                rows={1}
                placeholder='댓글 달기...'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type='submit'
                style={{
                  display: comment.length > 0 ? "block" : "none",
                  background: "none",
                  color: "#0095f6",
                  border: "none",
                  fontWeight: "700",
                }}
              >
                게시
              </button>
            </form>
          </FormContainer>
        )}
      </Wrapper>
    </div>
  );
}

export default PostDetail;
