import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const token = localStorage.getItem("token");


  return (
    <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected route */}
            <Route
              path="/dashboard"
              element={token ? <Dashboard /> : <Navigate to="/login" />}
            />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
  )
}

export default App
