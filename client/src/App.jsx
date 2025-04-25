"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Gallery from "./pages/Gallery"
import Upload from "./pages/Upload"
import Footer from "./components/Footer"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import Profile from "./pages/Profile"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (token) {
      fetch("http://localhost:5000/api/users/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setIsAuthenticated(true)
            setUser(data.user)
          } else {
            localStorage.removeItem("token")
          }
        })
        .catch((err) => {
          console.error("Error verifying token:", err)
          localStorage.removeItem("token")
        })
    }
  }, [])

  const login = (userData, token) => {
    localStorage.setItem("token", token)
    setIsAuthenticated(true)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <Router>
      <div className="app-container d-flex flex-column min-vh-100">
        <Navbar isAuthenticated={isAuthenticated} logout={logout} user={user} />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login login={login} />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/gallery" element={isAuthenticated ? <Gallery /> : <Navigate to="/login" />} />
            <Route path="/upload" element={isAuthenticated ? <Upload /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile user={user} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
