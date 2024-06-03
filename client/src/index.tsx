import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import User from "./components/User";
import Home from "./components/Home";
import Upload from "./components/Upload";
import Edit from "./components/Edit";
import Join from "./components/Join";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/' element={<Home />} />
          <Route path='/join' element={<Join />} />
        </Route>
        <Route path='/users/*' element={<App />}>
          <Route path='edit' element={<User />} />
        </Route>
        <Route path='/posts/*' element={<App />}>
          <Route path='upload' element={<Upload />} />
          <Route path=':id/edit' element={<Edit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
