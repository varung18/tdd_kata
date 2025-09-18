import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/background.png";

const Auth = () => {
  const navigate = useNavigate(); // hook for navigation
  const [isLogin, setIsLogin] = useState(true); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login API
        const res = await axios.post("http://localhost:8080/api/auth/login", { username, password });
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        // Register API
        await axios.post("http://localhost:8080/api/auth/register", { username, password });
        setMessage("Registration successful! You can now login.");
        setIsLogin(true); // switch to login after register
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative"
    }}>
      {/* Overlay for better contrast */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(1px)"
      }} />
      
      <div style={{
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))",
        backdropFilter: "blur(20px)",
        padding: "50px 45px",
        borderRadius: "24px",
        boxShadow: `
          0 20px 60px rgba(0,0,0,0.15),
          0 8px 25px rgba(0,0,0,0.1),
          inset 0 1px 0 rgba(255,255,255,0.8)
        `,
        width: "420px",
        textAlign: "center",
        position: "relative",
        border: "1px solid rgba(255,255,255,0.3)",
        transform: "translateY(0px)",
        transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = `
          0 30px 80px rgba(0,0,0,0.2),
          0 12px 35px rgba(0,0,0,0.15),
          inset 0 1px 0 rgba(255,255,255,0.9)
        `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = `
          0 20px 60px rgba(0,0,0,0.15),
          0 8px 25px rgba(0,0,0,0.1),
          inset 0 1px 0 rgba(255,255,255,0.8)
        `;
      }}>
        
        {/* Decorative elements */}
        <div style={{
          position: "absolute",
          top: "-10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60px",
          height: "4px",
          background: "linear-gradient(90deg, #ff9a9e, #fecfef, #fecfef, #ff9a9e)",
          borderRadius: "4px"
        }} />
        
        <div style={{
          fontSize: "2.2em",
          marginBottom: "8px"
        }}></div>
        
        <h2 style={{ 
          marginBottom: "30px", 
          color: "#2d3748",
          fontSize: "28px",
          fontWeight: "600",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          transition: "all 0.5s ease-in-out",
          opacity: 1,
          transform: "translateY(0px)"
        }}>
          {isLogin ? "Welcome Back!" : "Join the Sweet Side"}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "20px" 
        }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              style={{
                width: "100%",
                padding: "16px 20px",
                borderRadius: "16px",
                border: "2px solid rgba(255,255,255,0.3)",
                outline: "none",
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(10px)",
                fontSize: "16px",
                color: "#2d3748",
                boxSizing: "border-box",
                transition: "all 0.3s ease"
              }}
              onFocus={(e) => {
                e.target.style.border = "2px solid #ff9a9e";
                e.target.style.background = "rgba(255,255,255,0.9)";
                e.target.style.transform = "scale(1.02)";
              }}
              onBlur={(e) => {
                e.target.style.border = "2px solid rgba(255,255,255,0.3)";
                e.target.style.background = "rgba(255,255,255,0.7)";
                e.target.style.transform = "scale(1)";
              }}
            />
          </div>
          
          <div style={{ position: "relative" }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={{
                width: "100%",
                padding: "16px 20px",
                borderRadius: "16px",
                border: "2px solid rgba(255,255,255,0.3)",
                outline: "none",
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(10px)",
                fontSize: "16px",
                color: "#2d3748",
                boxSizing: "border-box",
                transition: "all 0.3s ease"
              }}
              onFocus={(e) => {
                e.target.style.border = "2px solid #ff9a9e";
                e.target.style.background = "rgba(255,255,255,0.9)";
                e.target.style.transform = "scale(1.02)";
              }}
              onBlur={(e) => {
                e.target.style.border = "2px solid rgba(255,255,255,0.3)";
                e.target.style.background = "rgba(255,255,255,0.7)";
                e.target.style.transform = "scale(1)";
              }}
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              padding: "16px 20px",
              borderRadius: "16px",
              border: "none",
              background: "linear-gradient(135deg, #e53e3e 0%, #ff6b6b 50%, #fd79a8 100%)",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
              boxShadow: "0 8px 25px rgba(229, 62, 62, 0.4)",
              position: "relative",
              overflow: "hidden",
              textShadow: "0 1px 2px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px) scale(1.02)";
              e.target.style.boxShadow = "0 12px 35px rgba(229, 62, 62, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0px) scale(1)";
              e.target.style.boxShadow = "0 8px 25px rgba(229, 62, 62, 0.4)";
            }}
          >
            <span style={{ position: "relative", zIndex: 1 }}>
              {isLogin ? "Login" : "Register"}
            </span>
          </button>
        </form>

        <div style={{
          marginTop: "25px",
          padding: "15px 0",
          borderTop: "1px solid rgba(255,255,255,0.3)"
        }}>
          <p style={{ 
            margin: 0, 
            color: "#2d323aff",
            fontSize: "15px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            transition: "all 0.5s ease-in-out",
            opacity: 1,
            transform: "translateY(0px)"
          }}>
            {isLogin ? "New to our bakery?" : "Already have an account?"}{" "}
            <span
              onClick={() => {
                // Add a subtle fade effect during transition
                const elements = [
                  document.querySelector('h2'),
                  document.querySelector('button[type="submit"] span'),
                  document.querySelector('p')
                ];
                
                elements.forEach(el => {
                  if (el) {
                    el.style.opacity = '0.7';
                    el.style.transform = 'translateY(-5px)';
                  }
                });
                
                setTimeout(() => {
                  setIsLogin(!isLogin);
                  setMessage("");
                  
                  // Restore elements after state change
                  setTimeout(() => {
                    elements.forEach(el => {
                      if (el) {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0px)';
                      }
                    });
                  }, 100);
                }, 200);
              }}
              style={{ 
                color: "#af6d70ff", 
                cursor: "pointer", 
                fontWeight: "600",
                textDecoration: "none",
                borderBottom: "1px solid transparent",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.borderBottom = "1px solid #ff9a9e";
                e.target.style.color = "#fda085";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderBottom = "1px solid transparent";
                e.target.style.color = "#ff9a9e";
              }}
            >
              {isLogin ? "Join us!" : "Sign in instead"}
            </span>
          </p>
        </div>

        {message && (
          <div style={{
            marginTop: "20px",
            padding: "12px 16px",
            borderRadius: "12px",
            background: message.includes("Error") 
              ? "linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 107, 107, 0.05))"
              : "linear-gradient(135deg, rgba(72, 187, 120, 0.1), rgba(72, 187, 120, 0.05))",
            border: `1px solid ${message.includes("Error") ? "rgba(255, 107, 107, 0.3)" : "rgba(72, 187, 120, 0.3)"}`,
            color: message.includes("Error") ? "#e53e3e" : "#38a169",
            fontSize: "14px",
            fontWeight: "500"
          }}>
            {message}
          </div>
        )}
        
        
      </div>
    </div>
  );
};

export default Auth;