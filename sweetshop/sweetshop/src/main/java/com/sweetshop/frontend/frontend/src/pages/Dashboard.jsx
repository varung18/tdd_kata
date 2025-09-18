import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const navigate = useNavigate();

  const fetchSweets = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/sweets", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setSweets(res.data);
    } catch (err) {
      console.error(err);
      alert("Unauthorized! Please login again.");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  return (
    <div>
      <h2>Sweets Dashboard</h2>
      <button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>
        Logout
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {sweets.map((sweet) => (
          <div key={sweet.id} style={{ border: "1px solid #ccc", padding: "1rem" }}>
            <h3>{sweet.name}</h3>
            <p>Category: {sweet.category}</p>
            <p>Price: INR. {sweet.price}</p>
            <p>Quantity: {sweet.quantity}</p>
            <button disabled={sweet.stock === 0}>Purchase</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
