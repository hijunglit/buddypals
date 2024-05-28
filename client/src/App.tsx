import React from "react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className='w-full p-6'>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
