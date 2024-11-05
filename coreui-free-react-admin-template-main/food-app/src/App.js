import React from "react";
import {Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import UserRegister from "./components/Layouts/HeaderComponent/UserRegister/UserRegister";
import Admin from "./components/Layouts/Admin";


function App() {
  
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/register" element={<UserRegister />} />
      </Routes>
  );
}

export default App;
