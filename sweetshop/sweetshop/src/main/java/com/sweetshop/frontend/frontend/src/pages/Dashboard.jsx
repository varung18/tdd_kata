import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Inline SVG icons to replace react-icons/fa
const EditIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="16" height="16" fill="currentColor" {...props}>
    <path d="M402.6 83.2l-10.2 11.2-4.1-1.3-4.2-1.3L400.3 80c-7.9-1.9-15.9 1.4-20.7 7.4L114.2 380.2l12.4 12.4 135.2 135.2L421.1 274.6c2.7-2.6 5.6-5 8.7-7.2l13.6-9.7 13.6-9.7c5.6-3.8 8.4-9.8 8.7-16.1l.1-1.2.1-1.2V112c0-8.8-7.2-16-16-16H416c-8.8 0-16 7.2-16 16v88.2l20.8-20.8L402.6 83.2zM286.7 480.1L24 480c-13.3 0-24-10.7-24-24V329.3c0-1.8 .1-3.6 .2-5.4L208.6 114.7l13.5 13.5-197.8 197.8c-2 2-3.1 4.7-3.1 7.6v127.4c0 1.5 1.2 2.7 2.7 2.7h127.4c2.8 0 5.5-1.1 7.6-3.1l197.8-197.8 13.5 13.5L286.7 480.1zM560 210.7L448 98.7V32c0-17.7-14.3-32-32-32H160C142.3 0 128 14.3 128 32v240c0 17.7 14.3 32 32 32h288c17.7 0 32-14.3 32-32V112l32.7 32.7L560 210.7zM422.6 83.2L555.2 215.8 422.6 348.4 290 215.8 422.6 83.2z"/>
  </svg>
);
const TrashIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="currentColor" {...props}>
    <path d="M135.2 17.6c-4.5-10-8.3-15.6-13.9-17.2-11-3.2-22.3 5.3-25.5 16.3L89.6 40.5c-6.8-2.6-14-3.5-21.2-2.9C52.7 38.3 40 45.9 31.8 58l-5.3 7.9c-8.8 13.1-10.7 29.8-5.3 44.5L50.5 128H44.8C20.1 128 0 148.1 0 172.8V216c0 1.2.1 2.3.2 3.5l1.8 23c6.9 88.3 40.8 163.7 110.1 228.8c42.8 39.8 91.1 63.8 141.5 72.8c11.7 2.1 23.6 3.1 35.5 3.1h1c4.9 0 9.7-.3 14.6-.9l1-1.3c21-27.8 38.6-56.1 52.8-85.7c26.9-56.3 43-118.8 44.1-182.2l1.3-76.8L448 217.3V176c0-12.9-5.1-25.7-14.1-34.9l-45.9-46c-9.1-9.1-21.8-14.1-34.9-14.1H292.8c-12.9 0-25.7 5.1-34.9 14.1l-14.1 14.1L238.7 85.3 170 30.2l-34.8-12.6zM296 464c-31.5-6-62.4-18.7-90.3-38.6c-39.7-27.9-72-65.5-94.8-109.8c-13.8-26.6-24-54.8-30.2-84.4l-1.3-66.2H388.5l-1.4 67.5c-6 29-16.1 56.6-29.6 82.5-22.5 43.1-54.5 80-93.5 107.4c-28.2 19.4-58.8 31.5-90.8 37.5zM200 240v128c0 8.8-7.2 16-16 16s-16-7.2-16-16V240c0-8.8 7.2-16 16-16s16 7.2 16 16zm64 0v128c0 8.8-7.2 16-16 16s-16-7.2-16-16V240c0-8.8 7.2-16 16-16s16 7.2 16 16z"/>
  </svg>
);
const PlusIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="currentColor" {...props}>
    <path d="M432 256c0 17.7-14.3 32-32 32H288c-17.7 0-32-14.3-32-32V128c0-17.7-14.3-32-32-32s-32 14.3-32 32v128H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h128v128c0 17.7 14.3 32 32 32s32-14.3 32-32V320h128c17.7 0 32-14.3 32-32z"/>
  </svg>
);
const SearchIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16" fill="currentColor" {...props}>
    <path d="M416 208c0 45.9-14.9 88.3-40.4 121.7L469.7 435.5c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L341.3 360.4c-33.4 25.5-75.8 40.4-121.7 40.4C93.1 400 0 306.9 0 208S93.1 16 208 16s208 93.1 208 192zM208 64c-88.4 0-160 71.6-160 160s71.6 160 160 160s160-71.6 160-160s-71.6-160-160-160z"/>
  </svg>
);
const SyncIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16" fill="currentColor" {...props}>
    <path d="M472 232c-6.6 0-12 5.4-12 12s5.4 12 12 12c40.8 0 74.3 33.5 74.3 74.3c0 40.8-33.5 74.3-74.3 74.3c-24.4 0-46.7-12-61.6-31.5-3.3-4.3-9.5-5.2-14.1-2l-40.8 30.6c-4.6 3.4-6.3 9.7-3.9 15c26.9 59.9 89.2 100 160.4 100C491 480 544 427 544 360c0-67-53-120-120-120zM208 280c-4.4 0-8-3.6-8-8V88c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v184c0 4.4-3.6 8-8 8h-48zM186.2 368c-1.2 0-2.4-.2-3.6-.5c-4.9-1.2-8.3-6.2-7.1-11.1l11.1-45.2c1.2-4.9 6.2-8.3 11.1-7.1l45.2 11.1c4.9 1.2 8.3 6.2 7.1 11.1l-11.1 45.2c-1.2 4.9-6.2 8.3-11.1 7.1L186.2 368zM312 360c-4.4 0-8-3.6-8-8V152c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v200c0 4.4-3.6 8-8 8h-48zM128 360c-4.4 0-8-3.6-8-8V152c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v200c0 4.4 3.6 8-8 8h-48zM40 280c-4.4 0-8-3.6-8-8V88c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v184c0 4.4 3.6 8-8 8h-48zM240 104c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V104zM368 104c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V104zM496 104c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V104zM24 240c-4.4 0-8-3.6-8-8V88c0-4.4 3.6-8 8-8H40c-4.4 0-8 3.6-8 8v152c0 4.4 3.6 8 8 8h-48c-4.4 0-8 3.6-8 8v-152z"/>
  </svg>
);

// New component for a single sweet card
const SweetCard = ({ sweet, isAdmin, mediaUrls, handlePurchase, setEditSweet, handleDeleteSweet, handleRestockSweet }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="sweet-card"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="media-container group">
        <div className="sweet-media-wrapper">
          {mediaUrls[sweet.id]?.photo ? (
            <img
              src={mediaUrls[sweet.id].photo}
              alt={sweet.name}
              className={`sweet-image ${isHovering && mediaUrls[sweet.id]?.video ? 'opacity-0' : 'opacity-100'}`}
            />
          ) : (
            <span style={{ color: '#999', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>No media available</span>
          )}
          {isHovering && mediaUrls[sweet.id]?.video && (
            <video
              autoPlay
              preload="auto"
              muted
              loop
              playsInline
              className="sweet-video"
            >
              <source src={mediaUrls[sweet.id].video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>

      <h3>{sweet.name}</h3>
      <p>Category: <span>{sweet.category}</span></p>
      <p>Price: <span>₹{sweet.price}</span></p>
      <p>Quantity: <span>{sweet.quantity}</span></p>

      <div className="actions-container">
        <button
          onClick={() => handlePurchase(sweet.id)}
          disabled={sweet.quantity === 0}
          className="action-btn purchase-btn"
        >
          {sweet.quantity === 0 ? "Out of Stock" : "Purchase"}
        </button>
        {isAdmin && (
          <>
            <button onClick={() => setEditSweet(sweet)} className="action-btn edit-btn">
              <EditIcon /> Edit
            </button>
            <button onClick={() => handleDeleteSweet(sweet.id)} className="action-btn delete-btn">
              <TrashIcon /> Delete
            </button>
            <button onClick={() => handleRestockSweet(sweet.id)} className="action-btn restock-btn">
              <PlusIcon /> Restock
            </button>
          </>
        )}
      </div>
    </div>
  );
};


function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilterForm, setShowFilterForm] = useState(false);
  const [newSweet, setNewSweet] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    photo: null,
    video: null,
  });
  const [editSweet, setEditSweet] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    category: "",
    name: "",
  });
  const [editFiles, setEditFiles] = useState({ photo: null, video: null });
  const [mediaUrls, setMediaUrls] = useState({});

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.trim();

  const isAdmin =
    role === "ROLE_ADMIN" ||
    role === "ADMIN" ||
    role?.toUpperCase() === "ADMIN" ||
    role?.toUpperCase() === "ROLE_ADMIN";

  const fetchSweets = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/sweets", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSweets(res.data);
    } catch (err) {
      console.error(err);
      alert("Unauthorized! Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (sweetId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/sweets/${sweetId}/purchase`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Purchase successful! 🛒");
      fetchSweets(); // refresh list after purchase
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Purchase failed 😞");
    }
  };

  const handleAddSweet = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newSweet.name);
      formData.append("category", newSweet.category);
      formData.append("price", newSweet.price);
      formData.append("quantity", newSweet.quantity);

      if (newSweet.photo) {
        formData.append("photo", newSweet.photo);
      }

      if (newSweet.video) {
        formData.append("video", newSweet.video);
      }

      await axios.post("http://localhost:8080/api/sweets", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Sweet added! 🎉");
      setNewSweet({
        name: "",
        category: "",
        price: "",
        quantity: "",
        photo: null,
        video: null,
      });
      setShowAddForm(false); // Hide the form after adding sweet
      fetchSweets();
    } catch (err) {
      console.error(err);
      alert("Failed to add sweet 😞");
    }
  };

  const handleUpdateSweet = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editSweet.name);
      formData.append("category", editSweet.category);
      formData.append("price", editSweet.price);
      formData.append("quantity", editSweet.quantity);

      if (editFiles.photo) {
        formData.append("photo", editFiles.photo);
      }

      if (editFiles.video) {
        formData.append("video", editFiles.video);
      }

      await axios.put(`http://localhost:8080/api/sweets/${editSweet.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Sweet updated! ✅");
      setEditSweet(null);
      setEditFiles({ photo: null, video: null });
      fetchSweets();
    } catch (err) {
      console.error(err);
      alert("Failed to update sweet 😞");
    }
  };

  const handleDeleteSweet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sweet?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/sweets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Sweet deleted! 🗑️");
      fetchSweets();
    } catch (err) {
      console.error(err);
      alert("Failed to delete sweet 😞");
    }
  };

  const handleRestockSweet = async (id) => {
    const qty = prompt("Enter quantity to restock:");
    if (!qty || isNaN(qty) || Number(qty) <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }
    try {
      await axios.post(
        `http://localhost:8080/api/sweets/${id}/restock?amount=${qty}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Sweet restocked! 📦");
      fetchSweets();
    } catch (err) {
      console.error(err);
      alert("Failed to restock sweet 😞");
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.category) params.append("category", filters.category);
      if (filters.name) params.append("name", filters.name);

      const url =
        params.toString().length > 0
          ? `http://localhost:8080/api/sweets/search?${params.toString()}`
          : "http://localhost:8080/api/sweets";

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSweets(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to search sweets 😔");
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    const fetchMedia = async () => {
      const newMediaUrls = {};
      for (const sweet of sweets) {
        try {
          // Fetch photo
          const photoUrl = `http://localhost:8080/api/sweets/${sweet.id}/photo`;
          const photoRes = await axios.get(photoUrl, { responseType: 'blob' });
          if (photoRes.data.size > 0) {
            newMediaUrls[sweet.id] = { ...newMediaUrls[sweet.id], photo: URL.createObjectURL(photoRes.data) };
          }

          // Fetch video
          const videoUrl = `http://localhost:8080/api/sweets/${sweet.id}/video`;
          const videoRes = await axios.get(videoUrl, { responseType: 'blob' });
          if (videoRes.data.size > 0) {
            newMediaUrls[sweet.id] = { ...newMediaUrls[sweet.id], video: URL.createObjectURL(videoRes.data) };
          }
        } catch (error) {
          console.error(`Failed to fetch media for sweet ID ${sweet.id}:`, error);
          // Don't set a URL for this sweet, so it falls back to "No media available"
        }
      }
      setMediaUrls(newMediaUrls);
    };

    if (sweets.length > 0) {
      fetchMedia();
    }
  }, [sweets]);


  if (loading) return <div className="loading-container"><h3>Loading sweets... ⏳</h3></div>;

  return (
    <div className="dashboard-container">
      <style>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background-color: #f0f2f5;
          margin: 0;
          padding: 0;
        }

        .dashboard-container {
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 24px;
          color: #555;
        }

        h2 {
          text-align: center;
          color: #333;
          font-size: 2.5rem;
          margin-bottom: 20px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }

        h3 {
          color: #555;
          border-bottom: 2px solid #ddd;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logout-btn {
          display: block;
          margin: 0 auto 30px;
          padding: 10px 20px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
        }
        
        .forms-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          position: relative;
        }
        
        .form-section {
          background-color: #fff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
          flex: 1;
          position: relative;
        }

        .form-toggle-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 12px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .form-toggle-btn.search {
          background-color: #007bff;
        }
        .form-toggle-btn.search:hover {
          background-color: #0056b3;
        }

        .form-toggle-btn:hover {
            background-color: #218838;
            transform: translateY(-1px);
        }

        .add-sweet-form, .search-form-expanded {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          margin-top: 15px;
          background-color: #fff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
          z-index: 10;
          animation: fadeIn 0.5s ease-in-out;
        }

        .add-sweet-form {
          right: 0;
          left: unset;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          align-items: flex-end;
        }
        
        .form-field {
          display: flex;
          flex-direction: column;
        }
        
        .form-field label {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
          font-weight: 600;
        }

        input[type="text"], input[type="number"], input[type="file"] {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
        }
        
        input[type="text"]:focus, input[type="number"]:focus, input[type="file"]:focus {
          border-color: #007bff;
          outline: none;
        }

        .add-btn {
          padding: 12px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.2s ease, transform 0.2s ease;
          margin-top: 10px;
          grid-column: 1 / -1;
        }

        .add-btn:hover {
          background-color: #218838;
          transform: translateY(-1px);
        }

        .search-btn, .reset-btn {
          padding: 10px 15px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: transform 0.2s ease;
          display: flex;
          align-items: center;
          gap: 5px;
          flex-grow: 1;
        }

        .search-btn {
          background-color: #007bff;
          color: white;
        }
        
        .search-btn:hover {
          background-color: #0056b3;
          transform: translateY(-1px);
        }

        .reset-btn {
          background-color: #6c757d;
          color: white;
        }
        
        .reset-btn:hover {
          background-color: #5a6268;
          transform: translateY(-1px);
        }

        .search-bar-container {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .sweets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
        }

        .sweet-card {
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
          padding: 20px;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .sweet-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }

        .sweet-card h3 {
          margin-top: 0;
          color: #007bff;
          font-size: 1.5rem;
          border-bottom: none;
        }

        .sweet-card p {
          margin: 5px 0;
          color: #666;
        }

        .sweet-card p:first-of-type {
          font-weight: bold;
        }
        
        .sweet-card p span {
          color: #333;
          font-weight: normal;
        }

        .media-container {
          position: relative;
          width: 100%;
          min-height: 180px;
          margin-bottom: 15px;
          border-radius: 8px;
          overflow: hidden;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Styles for the image and video within the container */
        .sweet-media-wrapper {
          position: relative;
          width: 100%;
          padding-top: 100%; /* Creates a 1:1 aspect ratio container */
        }
        
        .sweet-image, .sweet-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.3s ease-in-out;
        }
        
        .actions-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: auto;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }

        .action-btn {
          padding: 8px 12px;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
          color: white;
          transition: opacity 0.2s ease, transform 0.2s ease;
          display: flex;
          align-items: center;
          gap: 5px;
          flex-grow: 1;
          justify-content: center;
        }
        
        .action-btn:hover {
          opacity: 0.85;
          transform: translateY(-1px);
        }

        .purchase-btn {
          background-color: #28a745;
        }

        .purchase-btn[disabled] {
          background-color: #6c757d;
          cursor: not-allowed;
        }

        .edit-btn {
          background-color: #ffc107;
          color: #333;
        }

        .delete-btn {
          background-color: #dc3545;
        }

        .restock-btn {
          background-color: #007bff;
        }
        
        .save-btn {
          background-color: #28a745;
          color: white;
        }
        
        .cancel-btn {
          background-color: #dc3545;
          color: white;
        }
        
        .add-sweet-photo, .add-sweet-video {
            display: flex;
            flex-direction: column;
            gap: 5px;
            padding: 10px;
            border: 1px dashed #ccc;
            border-radius: 8px;
            margin-top: 10px;
        }
        
        .add-sweet-photo span, .add-sweet-video span {
          font-size: 14px;
          font-weight: 600;
          color: #555;
        }
      `}</style>
      <header>
        <h2>🍬 Sweet Shop Dashboard 🍭</h2>
        <button onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/");
        }} className="logout-btn">
          Logout
        </button>
      </header>
      
      <div className="forms-container">
        <section className="form-section">
          <div className="search-bar-container">
            <input
              type="text"
              name="name"
              placeholder="Search by name"
              value={filters.name}
              onChange={handleFilterChange}
            />
            <button
              className="form-toggle-btn search"
              onClick={() => setShowFilterForm(!showFilterForm)}
            >
              <SearchIcon /> {showFilterForm ? "Hide Filters" : "Filter"}
            </button>
          </div>
          {showFilterForm && (
            <div className="search-form-expanded">
              <div className="form-grid">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={filters.category}
                  onChange={handleFilterChange}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button onClick={handleSearch} className="search-btn">
                  <SearchIcon /> Search
                </button>
                <button
                  onClick={() => {
                    setFilters({ minPrice: "", maxPrice: "", category: "", name: "" });
                    fetchSweets(); // reset to all sweets
                  }}
                  className="reset-btn"
                >
                  <SyncIcon /> Reset
                </button>
              </div>
            </div>
          )}
        </section>

        {isAdmin && (
          <section className="form-section">
            <button className="form-toggle-btn" onClick={() => setShowAddForm(!showAddForm)}>
              <PlusIcon /> {showAddForm ? "Hide Add Sweet Form" : "Add New Sweet"}
            </button>
            {showAddForm && (
              <div className="add-sweet-form">
                <div className="form-grid">
                  <input
                    placeholder="Name"
                    value={newSweet.name}
                    onChange={(e) => setNewSweet({ ...newSweet, name: e.target.value })}
                  />
                  <input
                    placeholder="Category"
                    value={newSweet.category}
                    onChange={(e) => setNewSweet({ ...newSweet, category: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newSweet.price}
                    onChange={(e) => setNewSweet({ ...newSweet, price: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={newSweet.quantity}
                    onChange={(e) => setNewSweet({ ...newSweet, quantity: e.target.value })}
                  />
                  <div className="add-sweet-photo">
                    <span>📷 Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewSweet({ ...newSweet, photo: e.target.files[0] })}
                    />
                  </div>
                  <div className="add-sweet-video">
                    <span>🎥 Video</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setNewSweet({ ...newSweet, video: e.target.files[0] })}
                    />
                  </div>
                  <button onClick={handleAddSweet} className="add-btn">
                    <PlusIcon /> Add Sweet
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <hr style={{border: "none", borderTop: "2px solid #ddd", margin: "40px 0"}} />

      <main className="sweets-grid">
        {sweets.length === 0 ? (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#888", fontSize: "1.2rem" }}>
            No sweets available.
          </p>
        ) : (
          sweets.map((sweet) => (
            <React.Fragment key={sweet.id}>
              {editSweet?.id === sweet.id ? (
                // Edit form section
                <div className="sweet-card">
                  <h3>Edit Sweet</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div className="form-field">
                      <label>Name</label>
                      <input
                        placeholder="Name"
                        value={editSweet.name}
                        onChange={(e) => setEditSweet({ ...editSweet, name: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <label>Category</label>
                      <input
                        placeholder="Category"
                        value={editSweet.category}
                        onChange={(e) => setEditSweet({ ...editSweet, category: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <label>Price</label>
                      <input
                        type="number"
                        placeholder="Price"
                        value={editSweet.price}
                        onChange={(e) => setEditSweet({ ...editSweet, price: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <label>Quantity</label>
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={editSweet.quantity}
                        onChange={(e) => setEditSweet({ ...editSweet, quantity: e.target.value })}
                      />
                    </div>

                    <div className="form-field">
                      {mediaUrls[sweet.id]?.photo && (
                        <div style={{ marginBottom: "10px" }}>
                          <label style={{ fontWeight: "bold", fontSize: "14px" }}>Current Photo:</label>
                          <img
                            src={mediaUrls[sweet.id].photo}
                            alt="Current"
                            style={{
                              width: "100%",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              marginTop: "5px",
                            }}
                          />
                        </div>
                      )}
                      <label style={{ fontWeight: "bold", fontSize: "14px" }}>📷 Update Photo (optional):</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditFiles({ ...editFiles, photo: e.target.files[0] })}
                      />
                      {editFiles.photo && (
                        <span style={{ fontSize: "12px", color: "green", marginTop: "5px" }}>
                          New photo selected: {editFiles.photo.name}
                        </span>
                      )}
                    </div>
                    <div className="form-field">
                      {mediaUrls[sweet.id]?.video && (
                        <div style={{ marginBottom: "10px" }}>
                          <label style={{ fontWeight: "bold", fontSize: "14px" }}>Current Video:</label>
                          <video
                            controls
                            style={{
                              width: "100%",
                              height: "100px",
                              borderRadius: "8px",
                              marginTop: "5px",
                            }}
                          >
                            <source src={mediaUrls[sweet.id].video} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                      <label style={{ fontWeight: "bold", fontSize: "14px" }}>🎥 Update Video (optional):</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setEditFiles({ ...editFiles, video: e.target.files[0] })}
                      />
                      {editFiles.video && (
                        <span style={{ fontSize: "12px", color: "green", marginTop: "5px" }}>
                          New video selected: {editFiles.video.name}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button onClick={handleUpdateSweet} className="action-btn save-btn">
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditSweet(null);
                          setEditFiles({ photo: null, video: null });
                        }}
                        className="action-btn cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <SweetCard 
                  sweet={sweet} 
                  isAdmin={isAdmin} 
                  mediaUrls={mediaUrls} 
                  handlePurchase={handlePurchase} 
                  setEditSweet={setEditSweet}
                  handleDeleteSweet={handleDeleteSweet}
                  handleRestockSweet={handleRestockSweet}
                />
              )}
            </React.Fragment>
          ))
        )}
      </main>
    </div>
  );
}

export default Dashboard;
