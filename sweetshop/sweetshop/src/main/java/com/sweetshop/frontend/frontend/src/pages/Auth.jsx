import React, { useState } from "react";
import axios from "axios";
import bgImage from "../assets/background.png";
import "./auth.css";

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login API
        const res = await axios.post("http://localhost:8080/api/auth/login", {
          username,
          password,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        onLoginSuccess(); // Call the prop function to update state
      } else {
        // Register API
        await axios.post("http://localhost:8080/api/auth/register", {
          username,
          password,
        });
        setMessage("Registration successful! You can now login.");
        setIsLogin(true); // switch to login after register
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  const handleFormSwitch = () => {
    // Add a subtle fade effect during transition
    const elements = [
      document.querySelector(".auth-title"),
      document.querySelector(".auth-button-text"),
      document.querySelector(".auth-switch-text"),
    ];

    elements.forEach((el) => {
      if (el) {
        el.classList.add("auth-fade-transition");
      }
    });

    setTimeout(() => {
      setIsLogin(!isLogin);
      setMessage("");

      // Restore elements after state change
      setTimeout(() => {
        elements.forEach((el) => {
          if (el) {
            el.classList.remove("auth-fade-transition");
          }
        });
      }, 100);
    }, 200);
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Overlay for better contrast */}
      <div className="auth-overlay" />

      <div className="auth-form-container">
        {/* Decorative elements */}
        <div className="auth-decorative-line" />

        <div className="auth-emoji"></div>

        <h2 className="auth-title">
          {isLogin ? "Welcome Back!" : "Join the Sweet Side"}
        </h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-container">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="auth-input"
            />
          </div>

          <div className="auth-input-container">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="auth-input"
            />
          </div>

          <button type="submit" className="auth-submit-button">
            <span className="auth-button-text">
              {isLogin ? "Login" : "Register"}
            </span>
          </button>
        </form>

        <div className="auth-divider">
          <p className="auth-switch-text">
            {isLogin ? "New to our bakery?" : "Already have an account?"}{" "}
            <span onClick={handleFormSwitch} className="auth-switch-link">
              {isLogin ? "Join us!" : "Sign in instead"}
            </span>
          </p>
        </div>

        {message && (
          <div
            className={`auth-message ${
              message.includes("Error") ? "error" : "success"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
