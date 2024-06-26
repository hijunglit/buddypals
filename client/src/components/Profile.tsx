import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../atoms/atom";
import styled from "styled-components";

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

const Header = styled.header``;
const UserThumb = styled.div``;
const Controller = styled.div``;
const UserName = styled.h1``;
const Posts = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;
const Post = styled.div<{ $imgsrc: string }>`
  width: 300px;
  height: 300px;
  background-image: url(http://localhost:5050/${(props) => props.$imgsrc});
  background-size: cover;
  background-position: center;
`;
function Profile() {
  const profile = useRecoilValue(authAtom);
  const params = useParams();
  const { id } = params;
  const [user, Setuser] = useState<IUserData>();
  useEffect(() => {
    (async () => {
      const response = await fetch(`http://localhost:5050/users/${id}`);
      const result = await response.json();
      Setuser(result.user);
    })();
  }, []);
  return (
    <>
      <Header>
        <UserName>{user?.username}</UserName>
        {user?._id === profile.user?.id ? (
          <Controller>
            <Link to={"edit"}>프로필 편집</Link>
          </Controller>
        ) : (
          ""
        )}
      </Header>
      <Posts>
        {user?.posts.map((post) => (
          <Post key={post._id} $imgsrc={post.img[0]}>
            {post.text}
          </Post>
        ))}
      </Posts>
    </>
  );
}

export default Profile;
