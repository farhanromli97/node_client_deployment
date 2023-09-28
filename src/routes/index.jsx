import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Settings from "../pages/Settings";
import Users from "../pages/Users";
import Cookies from "universal-cookie";
import axios from "axios"

const AppRoutes = () => {
  return (
    // create routes using ReactJS
    <BrowserRouter basename="/">
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* protected routes */}
        <Route path="/admin/*" element={<ProtectedRoutes />} />

      </Routes>
    </BrowserRouter>
  );
};

const ProtectedRoutes = () => {
  const cookies = new Cookies(null, {path: "/"})
  const token = cookies.get("token")
  const navigate = useNavigate()

  // check validity token to backend

  const checkToken = async () => {
    const config = {
      headers: {Authorization: `Bearer ${token}`}
    }
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/protected`, config)
      console.log(res)
      alert('Valid token')
    } catch (error) {
      console.error(error)
      alert(error.response.data.message)
      cookies.remove('token')
      navigate("/login")
    }
  }
  useEffect(() => {
    if(token){
      checkToken()
    }else{
      navigate('/login')
    }

  })

  return (
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default AppRoutes;
