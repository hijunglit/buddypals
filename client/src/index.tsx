import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Record from "./components/Record";
import RecordList from "./components/RecordList";
import User from "./components/User";
import Home from "./components/Home";
import Post from "./components/Post";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/' element={<Home />} />
          <Route path='/:id' element={<Post />} />
        </Route>
        <Route path='/users/edit' element={<App />}>
          <Route path='/users/edit' element={<User />} />
        </Route>
        <Route path='/posts/:id' element={<App />}>
          <Route path='/posts/:id' element={<Post />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
