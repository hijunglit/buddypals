import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #000;
  text-align: center;
  padding: 12px 0;
  margin: 0 auto;
  & a {
    padding: 0 10px;
    text-decoration: none;
  }
`;

export default function Navbar() {
  return (
    <Nav className='flex justify-between items-center mb-6'>
      <NavLink to='/'>Home</NavLink>

      <NavLink
        className='inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3'
        to='/posts/upload'
      >
        Upload
      </NavLink>
      <NavLink to='/login'>Login</NavLink>
      <NavLink to='/profile'>Profile</NavLink>
    </Nav>
  );
}
