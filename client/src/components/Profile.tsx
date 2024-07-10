import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../atoms/atom";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { API_BASE_URL } from "../urls";

interface IPostData {
  _id: string;
  img: string[];
  text: string;
  hashtags: string[];
  owner: string;
  createdAt: string;
}
interface IUserData {
  email: string;
  profileImgUrl: string;
  thumbnailImageUrl: string;
  username: string;
  name: string;
  intro: string;
  posts: IPostData[];
  _id: string;
}

const PageWrapper = styled.div<{ $isbigscreen: boolean }>`
  width: ${(props) => (props.$isbigscreen ? "calc(100% - 80px)" : null)};
  margin-left: ${(props) => (props.$isbigscreen ? "auto" : null)};
`;
const Wrapper = styled.div``;
const Header = styled.header`
  margin: 0 auto;
  display: flex;
  column-gap: 12px;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 120px;
`;
const UserThumb = styled.div<{ $userthumb: string }>`
  background-image: ${(props) => `url(${props.$userthumb})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 77px;
  height: 77px;
  border-radius: 50%;
`;
const Controller = styled.div`
  & button {
    background: #363636;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    padding: 6px 8px;
  }
`;
const UserName = styled.h1``;
const Figures = styled.div``;
const Posts = styled.div<{ $isbigscreen: boolean }>`
  display: grid;
  max-width: ${(props) => (props.$isbigscreen ? "975px" : null)};
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: ${(props) =>
    props.$isbigscreen ? "minmax(240px, 100%)" : "minmax(140px, 100%)"};
  gap: 2px;
  margin: 0 auto;
  padding: ${(props) => (props.$isbigscreen ? "8px 12px" : null)};
`;
const Post = styled.div<{ $imgsrc: string }>`
  background-image: url(http://localhost:5050/${(props) => props.$imgsrc});
  background-size: cover;
  background-position: center;
  height: 100%;
`;
function Profile() {
  const isDesktop: boolean = useMediaQuery({ minWidth: 992 });
  const isTablet: boolean = useMediaQuery({
    minWidth: 768,
    maxWidth: 991,
  });
  const isMobile: boolean = useMediaQuery({
    maxWidth: 767,
  });
  const profile = useRecoilValue(authAtom);
  const params = useParams();
  const { id } = params;
  const [user, Setuser] = useState<IUserData>();
  useEffect(() => {
    (async () => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      const result = await response.json();
      Setuser(result.user);
    })();
  }, [params.id]);
  return (
    <PageWrapper $isbigscreen={isTablet || isDesktop}>
      <Header>
        <UserThumb
          {...{
            $userthumb: user?.thumbnailImageUrl.includes("http://")
              ? user.thumbnailImageUrl
              : `http://localhost:5050/${user?.thumbnailImageUrl}`,
          }}
        />
        <Wrapper style={{ lineHeight: "2" }}>
          <UserName>{user?.username}</UserName>
          {user?._id === profile.user?.id ? (
            <Controller>
              <Link to={"edit"}>
                <button>프로필 편집</button>
              </Link>
            </Controller>
          ) : (
            ""
          )}
          <Figures>
            <h4>
              게시물 <strong>{user?.posts.length}</strong>
            </h4>
          </Figures>
        </Wrapper>
      </Header>
      <Posts $isbigscreen={isTablet || isDesktop}>
        {user?.posts.map((post) => (
          <Link to={"/posts/" + post._id} key={post._id}>
            <Post $imgsrc={post.img[0]} />
          </Link>
        ))}
      </Posts>
    </PageWrapper>
  );
}

export default Profile;
