import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Home from "./components/Home";
import Upload from "./components/Upload";
import Join from "./components/Join";
import Login from "./components/Login";
import Logout from "./components/Logout";
import { RecoilRoot } from "recoil";
import Redirection from "./Redirection";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import EditPost from "./components/EditPost";
import ChangePassword from "./components/ChangePassword";
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import Post from "./components/Post";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <RecoilRoot>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/' element={<Home />} />
          <Route path='' element={<PublicOnlyRoute />}>
            <Route path='/login' element={<Login />} />
            <Route path='/join' element={<Join />} />
          </Route>
        </Route>
        <Route path='/users/*' element={<App />}>
          <Route path='' element={<PublicOnlyRoute />}>
            <Route path='kakao/finish' element={<Redirection />} />
          </Route>
          <Route path='' element={<ProtectedRoute />}>
            <Route path='logout' element={<Logout />} />
            <Route path='change-password' element={<ChangePassword />} />
            <Route path=':id' element={<Profile />} />
            <Route path=':id/edit' element={<EditProfile />} />
          </Route>
        </Route>
        <Route path='/posts/*' element={<App />}>
          <Route path='' element={<ProtectedRoute />}>
            <Route path='upload' element={<Upload />} />
            <Route path=':id' element={<Post />} />
            <Route path=':id/edit' element={<EditPost />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </RecoilRoot>
  // </React.StrictMode>
);
