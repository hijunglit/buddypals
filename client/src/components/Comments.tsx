import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRecoilValue } from "recoil";
import { authAtom } from "../atoms/atom";
import axios from "axios";

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
const CommentsSection = styled.div``;
const HeaderBody = styled.div`
  display: flex;
  margin-top: 44px;
`;

function Comments() {
  const history = useNavigate();
  const params = useParams();
  const profile = useRecoilValue(authAtom);
  const { id } = params;
  const [post, setPost] = useState<IPostInfo>();
  console.log(post);
  const [comment, setComment] = useState("");
  useEffect(() => {
    (async () => {
      const response = await fetch(`http://localhost:5050/posts/${id}`);
      const result = await response.json();
      const post = result.post;
      setPost(post);
    })();
  }, []);
  const onGobackClick = () => history(-1);
  const handleSetValue = (event: any) => {
    setComment(event.target.value);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("text", comment);
    formData.append("profile", JSON.stringify(profile.user));
    console.log(formData);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    if (formJson.comment === "") {
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5050/api/post/${post?._id}/comments`,
        formJson
      );
      const result = await response.data;
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
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
            <PageTitle>댓글</PageTitle>
            <div style={{ width: "15px", height: "15px" }}></div>
          </div>
        </HeaderTop>
        <HeaderBody>
          <div
            style={{
              width: "32px",
              height: "32px",
              backgroundImage: `url(${
                post?.owner.thumbnailImageUrl.includes("http")
                  ? post?.owner.thumbnailImageUrl
                  : `http://localhost:5050/${post?.owner.thumbnailImageUrl}`
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "50%",
            }}
          ></div>
          <div>
            <div style={{ display: "flex" }}>
              <h5>{post?.owner.username}</h5>
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
      <CommentsSection>
        <ul></ul>
      </CommentsSection>
      {profile.isAuthenticated && (
        <div>
          <form onSubmit={handleSubmit}>
            <textarea
              style={{ resize: "none" }}
              name='text'
              cols={50}
              rows={1}
              placeholder='댓글 달기...'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type='submit'>게시</button>
          </form>
        </div>
      )}
    </>
  );
}

export default Comments;
