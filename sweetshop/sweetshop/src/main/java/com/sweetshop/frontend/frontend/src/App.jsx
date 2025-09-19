import './App.css'
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
    const token = localStorage.getItem("token");


  return (
    <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected route */}
            <Route
              path="/dashboard"
              element={token ? <Dashboard /> : <Navigate to="/login" replace/>}
            />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" replace/>} />
          </Routes>
        </BrowserRouter>
  )
}

export default App
