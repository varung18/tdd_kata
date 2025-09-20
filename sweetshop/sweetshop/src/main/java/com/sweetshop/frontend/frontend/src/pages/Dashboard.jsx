import React, { useEffect, useState } from "react";
import axios from "axios";
import halwaiImage from "../halwai.jpg";
import "./Dashboard.css";
import {
  EditIcon,
  TrashIcon,
  PlusIcon,
  SearchIcon,
  SyncIcon,
} from "./Icons.jsx";

// New component for a single sweet card
const SweetCard = ({
  sweet,
  isAdmin,
  mediaUrls,
  handlePurchase,
  setEditSweet,
  handleDeleteSweet,
  handleRestockSweet,
}) => {
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
              className={`sweet-image ${
                isHovering && mediaUrls[sweet.id]?.video
                  ? "opacity-0"
                  : "opacity-100"
              }`}
            />
          ) : (
            <span
              style={{
                color: "#999",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1,
              }}
            >
              No media available
            </span>
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
      <p>
        Category: <span>{sweet.category}</span>
      </p>
      <p>
        Price: <span>₹{sweet.price}</span>
      </p>
      <p>
        Quantity: <span>{sweet.quantity}</span>
      </p>

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
            <button
              onClick={() => setEditSweet(sweet)}
              className="action-btn edit-btn"
            >
              <EditIcon /> Edit
            </button>
            <button
              onClick={() => handleDeleteSweet(sweet.id)}
              className="action-btn delete-btn"
            >
              <TrashIcon /> Delete
            </button>
            <button
              onClick={() => handleRestockSweet(sweet.id)}
              className="action-btn restock-btn"
            >
              <PlusIcon /> Restock
            </button>
          </>
        )}
      </div>
    </div>
  );
};

function Dashboard({ onLogout }) {
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
      onLogout(); // Use the passed prop function to log out
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

      await axios.put(
        `http://localhost:8080/api/sweets/${editSweet.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
          const photoRes = await axios.get(photoUrl, { responseType: "blob" });
          if (photoRes.data.size > 0) {
            newMediaUrls[sweet.id] = {
              ...newMediaUrls[sweet.id],
              photo: URL.createObjectURL(photoRes.data),
            };
          }

          // Fetch video
          const videoUrl = `http://localhost:8080/api/sweets/${sweet.id}/video`;
          const videoRes = await axios.get(videoUrl, { responseType: "blob" });
          if (videoRes.data.size > 0) {
            newMediaUrls[sweet.id] = {
              ...newMediaUrls[sweet.id],
              video: URL.createObjectURL(videoRes.data),
            };
          }
        } catch (error) {
          console.error(
            `Failed to fetch media for sweet ID ${sweet.id}:`,
            error
          );
          // Don't set a URL for this sweet, so it falls back to "No media available"
        }
      }
      setMediaUrls(newMediaUrls);
    };

    if (sweets.length > 0) {
      fetchMedia();
    }
  }, [sweets]);

  if (loading)
    return (
      <div className="loading-container">
        <h3>Loading sweets... ⏳</h3>
      </div>
    );

  return (
    <div className="dashboard-container">
      <div class="ribbon-container">
        <header>
          <h2>🍬 Kata The Sweet Shop 🍭</h2>
          <button
            onClick={onLogout} // Use the passed prop function for logout
            className="logout-btn"
          >
            Login / Register
          </button>
        </header>

        <div class="forms-container">
          <section class="form-section">
            <div class="search-bar-container">
              <input
                type="text"
                name="name"
                placeholder="Search by name"
                value={filters.name}
                onChange={handleFilterChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <button
                class="form-toggle-btn search"
                onClick={() => setShowFilterForm(!showFilterForm)}
              >
                <SearchIcon /> {showFilterForm ? "Hide Filters" : "Filter"}
              </button>
            </div>
            {showFilterForm && (
              <div class="search-form-expanded">
                <div class="form-grid">
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
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "15px" }}
                >
                  <button onClick={handleSearch} class="search-btn">
                    <SearchIcon /> Search
                  </button>
                  <button
                    onClick={() => {
                      setFilters({
                        minPrice: "",
                        maxPrice: "",
                        category: "",
                        name: "",
                      });
                      fetchSweets(); // reset to all sweetss
                    }}
                    class="reset-btn"
                  >
                    <SyncIcon /> Reset
                  </button>
                </div>
              </div>
            )}
          </section>

          {isAdmin && (
            <section class="form-section">
              <button
                class="form-toggle-btn"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <PlusIcon />{" "}
                {showAddForm ? "Hide Add Sweet Form" : "Add New Sweet"}
              </button>
              {showAddForm && (
                <div class="add-sweet-form">
                  <div class="form-grid">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newSweet.name}
                      onChange={(e) =>
                        setNewSweet({ ...newSweet, name: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={newSweet.category}
                      onChange={(e) =>
                        setNewSweet({ ...newSweet, category: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={newSweet.price}
                      onChange={(e) =>
                        setNewSweet({ ...newSweet, price: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={newSweet.quantity}
                      onChange={(e) =>
                        setNewSweet({ ...newSweet, quantity: e.target.value })
                      }
                    />
                    <div class="add-sweet-photo">
                      <span>📷 Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setNewSweet({ ...newSweet, photo: e.target.files[0] })
                        }
                      />
                    </div>
                    <div class="add-sweet-video">
                      <span>🎥 Video</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          setNewSweet({ ...newSweet, video: e.target.files[0] })
                        }
                      />
                    </div>
                    <button onClick={handleAddSweet} class="add-btn">
                      <PlusIcon /> Add Sweet
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      <hr
        style={{
          border: "none",
          borderTop: "2px solid #ddd",
          margin: "40px 0",
        }}
      />

      <main className="sweets-grid">
        {sweets.length === 0 ? (
          <p
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              color: "#888",
              fontSize: "1.2rem",
            }}
          >
            No sweets available.
          </p>
        ) : (
          sweets.map((sweet) => (
            <React.Fragment key={sweet.id}>
              {editSweet?.id === sweet.id ? (
                // Edit form section
                <div className="sweet-card">
                  <h3>Edit Sweet</h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <div className="form-field">
                      <label>Name</label>
                      <input
                        placeholder="Name"
                        value={editSweet.name}
                        onChange={(e) =>
                          setEditSweet({ ...editSweet, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-field">
                      <label>Category</label>
                      <input
                        placeholder="Category"
                        value={editSweet.category}
                        onChange={(e) =>
                          setEditSweet({
                            ...editSweet,
                            category: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-field">
                      <label>Price</label>
                      <input
                        type="number"
                        placeholder="Price"
                        value={editSweet.price}
                        onChange={(e) =>
                          setEditSweet({ ...editSweet, price: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-field">
                      <label>Quantity</label>
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={editSweet.quantity}
                        onChange={(e) =>
                          setEditSweet({
                            ...editSweet,
                            quantity: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-field">
                      {mediaUrls[sweet.id]?.photo && (
                        <div style={{ marginBottom: "10px" }}>
                          <label
                            style={{ fontWeight: "bold", fontSize: "14px" }}
                          >
                            Current Photo:
                          </label>
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
                      <label style={{ fontWeight: "bold", fontSize: "14px" }}>
                        📷 Update Photo (optional):
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setEditFiles({
                            ...editFiles,
                            photo: e.target.files[0],
                          })
                        }
                      />
                      {editFiles.photo && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "green",
                            marginTop: "5px",
                          }}
                        >
                          New photo selected: {editFiles.photo.name}
                        </span>
                      )}
                    </div>
                    <div className="form-field">
                      {mediaUrls[sweet.id]?.video && (
                        <div style={{ marginBottom: "10px" }}>
                          <label
                            style={{ fontWeight: "bold", fontSize: "14px" }}
                          >
                            Current Video:
                          </label>
                          <video
                            controls
                            style={{
                              width: "100%",
                              height: "100px",
                              borderRadius: "8px",
                              marginTop: "5px",
                            }}
                          >
                            <source
                              src={mediaUrls[sweet.id].video}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                      <label style={{ fontWeight: "bold", fontSize: "14px" }}>
                        🎥 Update Video (optional):
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          setEditFiles({
                            ...editFiles,
                            video: e.target.files[0],
                          })
                        }
                      />
                      {editFiles.video && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "green",
                            marginTop: "5px",
                          }}
                        >
                          New video selected: {editFiles.video.name}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <button
                        onClick={handleUpdateSweet}
                        className="action-btn save-btn"
                      >
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
      {/* New Footer */}
      <footer className="dashboard-footer">
        <div className="footer-top">
          {/* Column 1: Text */}
          <div className="footer-column text-column">
            <p>
              Ranked #1 among the best sweet shops in Vadodara, our store takes
              pride in serving you the finest range of traditional and modern
              sweets. Every delight is prepared with love, purity, and unmatched
              taste — all while being 100% vegetarian. Look for the trusted
              green vegetarian logo, because at our shop, quality and
              authenticity are always guaranteed.
            </p>
          </div>
          {/* Column 2: Google Maps */}
          <div className="footer-column map-column">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118106.70010221681!2d73.17308625!3d22.32210265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc8ab91a3ddab%3A0xac39d3bfe1473fb8!2sVadodara%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1758291568900!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Google Map Location"
            ></iframe>
          </div>
          {/* Column 3: Image Placeholder */}
          <div className="footer-column image-column">
            {/* Replace the div with an img tag */}
            <img
              src={halwaiImage}
              alt="Assortment of traditional Indian sweets"
              className="footer-image"
              height="185px"
            />
          </div>
        </div>

        {/* Bottom 40% Section (Black) */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <span>Copyright 2025, Varun Gaur</span>
            <span>Call us on: 1234-95-94-93</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
