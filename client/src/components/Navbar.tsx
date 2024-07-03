import { NavLink } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { authAtom } from "../atoms/atom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUpload,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from "react-responsive";

const Nav = styled.nav<{ $isbigscreen: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$isbigscreen ? "column" : "row")};
  justify-content: ${(props) =>
    props.$isbigscreen ? "start" : "space-around"};
  position: fixed;
  bottom: 0;
  width: ${(props) => (props.$isbigscreen ? "80px" : "100%")};
  height: ${(props) => (props.$isbigscreen ? "100%" : "fit-content")};
  border-right: ${(props) =>
    props.$isbigscreen ? "1px solid #262626" : "none"};
  background: #000;
  text-align: center;
  padding: 12px 0;
  margin: 0 auto;
  border-top: ${(props) => (props.$isbigscreen ? "none" : "2px solid #262626")};
  & a {
    padding: ${(props) => (props.$isbigscreen ? "20px 10px" : "0px 10px")};
    text-decoration: none;
  }
  z-index: 9999;
`;
const Profile = styled.div<{ $profileimg: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-image: url(${(props) => props.$profileimg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  margin: 0 auto;
`;

export default function Navbar() {
  const isDesktop: boolean = useMediaQuery({ minWidth: 992 });
  const isTablet: boolean = useMediaQuery({
    minWidth: 768,
    maxWidth: 991,
  });
  const isMobile: boolean = useMediaQuery({
    maxWidth: 767,
  });
  const profile = useRecoilValue(authAtom);
  const authState = useRecoilValue(authAtom);
  return (
    <>
      {authState.isAuthenticated ? (
        <Nav
          className='flex justify-between items-center mb-6'
          $isbigscreen={isTablet || isDesktop}
        >
          <NavLink to='/'>
            <FontAwesomeIcon icon={faHome} size={isMobile ? "1x" : "lg"} />
            {isTablet || (isDesktop && <p>홈</p>)}
          </NavLink>

          <NavLink
            className='inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3'
            to='/posts/upload'
          >
            <FontAwesomeIcon icon={faUpload} size={isMobile ? "1x" : "xl"} />
            {isTablet || (isDesktop && <p>업로드</p>)}
          </NavLink>
          <NavLink to='/users/logout'>
            <FontAwesomeIcon
              icon={faSignOutAlt}
              size={isMobile ? "1x" : "lg"}
            />
            {isTablet || (isDesktop && <p>로그아웃</p>)}
          </NavLink>
          <NavLink to={`/users/${profile.user?.id}`}>
            <Profile
              $profileimg={String(
                profile.user?.thumbnailImage.includes("http://")
                  ? profile.user.thumbnailImage
                  : `http://localhost:5050/${profile.user?.thumbnailImage}`
              )}
            />
            {isTablet || (isDesktop && <p>프로필</p>)}
          </NavLink>
        </Nav>
      ) : (
        ""
      )}
    </>
  );
}
