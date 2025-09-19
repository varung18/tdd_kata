import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
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


  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.trim();

  const isAdmin = role === "ROLE_ADMIN" || role === "ADMIN" || role?.toUpperCase() === "ADMIN" || role?.toUpperCase() === "ROLE_ADMIN";

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
      alert("Purchase successful!");
      fetchSweets(); // refresh list after purchase
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Purchase failed");
    }
  };

  const handleAddSweet = async () => {
    try {
      // Create FormData for file uploads
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
          'Content-Type': 'multipart/form-data'
        },
      });
      alert("Sweet added!");
      setNewSweet({ name: "", category: "", price: "", quantity: "", photo: null, video: null });
      fetchSweets();
    } catch (err) {
      console.error(err);
      alert("Failed to add sweet");
    }
  };

  const handleUpdateSweet = async () => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append("name", editSweet.name);
      formData.append("category", editSweet.category);
      formData.append("price", editSweet.price);
      formData.append("quantity", editSweet.quantity);
      
      // Add new files if selected
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
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      alert("Sweet updated!");
      setEditSweet(null);
      setEditFiles({ photo: null, video: null });
      fetchSweets();
    } catch (err) {
      console.error(err);
      alert("Failed to update sweet");
    }
  };

  const handleDeleteSweet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sweet?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/sweets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Sweet deleted!");
      fetchSweets();
    } catch (err) {
      console.error(err);
      alert("Failed to delete sweet");
    }
  };

  const handleRestockSweet = async (id) => {
    const qty = prompt("Enter quantity to restock:");
    if (!qty) return;
    try {
      await axios.post(
        `http://localhost:8080/api/sweets/${id}/restock?amount=${qty}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Sweet restocked!");
      fetchSweets();
    } catch (err) {
      console.error(err);
      alert("Failed to restock sweet");
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
    alert("Failed to search sweets");
  }
};

  useEffect(() => {
    fetchSweets();
  }, []);

  if (loading) return <h3>Loading sweets...</h3>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sweets Dashboard</h2>
      

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/");
        }}
        style={{ marginBottom: "20px" }}
      >
        Logout
      </button>

      {/* Changed from role === "ROLE_ADMIN" to isAdmin */}
      {isAdmin && (
        <div style={{ marginBottom: "30px" }}>
          <h3>Add New Sweet</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
            <input
              placeholder="Name"
              value={newSweet.name}
              onChange={(e) => setNewSweet({ ...newSweet, name: e.target.value })}
            />
            <input
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
            
            {/* Photo Upload */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                📷 Upload Photo (optional):
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewSweet({ ...newSweet, photo: e.target.files[0] })}
                style={{ width: "100%" }}
              />
              {newSweet.photo && (
                <div style={{ marginTop: "5px", fontSize: "12px", color: "green" }}>
                  Selected: {newSweet.photo.name}
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                🎥 Upload Video (optional):
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setNewSweet({ ...newSweet, video: e.target.files[0] })}
                style={{ width: "100%" }}
              />
              {newSweet.video && (
                <div style={{ marginTop: "5px", fontSize: "12px", color: "green" }}>
                  Selected: {newSweet.video.name}
                </div>
              )}
            </div>

            <button 
              onClick={handleAddSweet}
              style={{ 
                padding: "10px", 
                backgroundColor: "#4CAF50", 
                color: "white", 
                border: "none", 
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Add Sweet
            </button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: "30px" }}>
  <h3>Search Sweets</h3>
  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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
    <input
      type="text"
      name="name"
      placeholder="Name"
      value={filters.name}
      onChange={handleFilterChange}
    />
    <button onClick={handleSearch}>Search</button>
    <button
      onClick={() => {
        setFilters({ minPrice: "", maxPrice: "", category: "", name: "" });
        fetchSweets(); // reset to all sweets
      }}
      style={{ background: "gray", color: "white" }}
    >
      Reset
    </button>
  </div>
</div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {sweets.length === 0 ? (
          <p>No sweets available.</p>
        ) : (
          sweets.map((sweet) => (
            <div
              key={sweet.id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
                background: "#f9f9f9",
              }}
            >
              {editSweet?.id === sweet.id ? (
                <>
                  <h3>Edit Sweet</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input
                      placeholder="Name"
                      value={editSweet.name}
                      onChange={(e) =>
                        setEditSweet({ ...editSweet, name: e.target.value })
                      }
                    />
                    <input
                      placeholder="Category"
                      value={editSweet.category}
                      onChange={(e) =>
                        setEditSweet({ ...editSweet, category: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={editSweet.price}
                      onChange={(e) =>
                        setEditSweet({ ...editSweet, price: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={editSweet.quantity}
                      onChange={(e) =>
                        setEditSweet({ ...editSweet, quantity: e.target.value })
                      }
                    />

                    {/* Current Photo Display */}
                    {sweet.photoUrl && (
                      <div>
                        <label style={{ fontWeight: "bold", fontSize: "12px" }}>Current Photo:</label>
                        <img 
                          src={sweet.photoUrl} 
                          alt="Current"
                          style={{ 
                            width: "100px", 
                            height: "60px", 
                            objectFit: "cover", 
                            borderRadius: "3px",
                            display: "block",
                            marginTop: "5px"
                          }}
                        />
                      </div>
                    )}

                    {/* Photo Upload for Edit */}
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", fontSize: "12px" }}>
                        📷 Update Photo (optional):
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditFiles({ ...editFiles, photo: e.target.files[0] })}
                        style={{ fontSize: "12px" }}
                      />
                      {editFiles.photo && (
                        <div style={{ fontSize: "11px", color: "green", marginTop: "2px" }}>
                          New photo selected: {editFiles.photo.name}
                        </div>
                      )}
                    </div>

                    {/* Current Video Display */}
                    {sweet.videoUrl && (
                      <div>
                        <label style={{ fontWeight: "bold", fontSize: "12px" }}>Current Video:</label>
                        <video 
                          controls 
                          style={{ 
                            width: "100px", 
                            height: "60px", 
                            borderRadius: "3px",
                            display: "block",
                            marginTop: "5px"
                          }}
                        >
                          <source src={sweet.videoUrl} type="video/mp4" />
                        </video>
                      </div>
                    )}

                    {/* Video Upload for Edit */}
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", fontSize: "12px" }}>
                        🎥 Update Video (optional):
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setEditFiles({ ...editFiles, video: e.target.files[0] })}
                        style={{ fontSize: "12px" }}
                      />
                      {editFiles.video && (
                        <div style={{ fontSize: "11px", color: "green", marginTop: "2px" }}>
                          New video selected: {editFiles.video.name}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
                      <button 
                        onClick={handleUpdateSweet}
                        style={{ 
                          backgroundColor: "#4CAF50", 
                          color: "white", 
                          border: "none", 
                          padding: "5px 10px", 
                          borderRadius: "3px" 
                        }}
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => {
                          setEditSweet(null);
                          setEditFiles({ photo: null, video: null });
                        }}
                        style={{ 
                          backgroundColor: "#f44336", 
                          color: "white", 
                          border: "none", 
                          padding: "5px 10px", 
                          borderRadius: "3px" 
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3>{sweet.name}</h3>
                  <p>Category: {sweet.category}</p>
                  <p>Price: ₹{sweet.price}</p>
                  <p>Quantity: {sweet.quantity}</p>

                  {/* Display Photo if available */}
                  {sweet.photoUrl && (
                    <div style={{ marginBottom: "10px" }}>
                      <img 
                        src={sweet.photoUrl} 
                        alt={sweet.name}
                        style={{ 
                          maxWidth: "100%", 
                          height: "150px", 
                          objectFit: "cover", 
                          borderRadius: "5px" 
                        }}
                      />
                    </div>
                  )}

                  {/* Display Video if available */}
                  {sweet.videoUrl && (
                    <div style={{ marginBottom: "10px" }}>
                      <video 
                        controls 
                        style={{ 
                          maxWidth: "100%", 
                          height: "150px", 
                          borderRadius: "5px" 
                        }}
                      >
                        <source src={sweet.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}

                  <button
                    onClick={() => handlePurchase(sweet.id)}
                    disabled={sweet.quantity === 0}
                  >
                    {sweet.quantity === 0 ? "Out of Stock" : "Purchase"}
                  </button>

                  {/* Changed from role === "ROLE_ADMIN" to isAdmin */}
                  {isAdmin && (
                    <div style={{ marginTop: "10px" }}>
                      <button onClick={() => setEditSweet(sweet)}>Edit</button>
                      <button
                        onClick={() => handleDeleteSweet(sweet.id)}
                        style={{ marginLeft: "5px", background: "red", color: "white" }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleRestockSweet(sweet.id)}
                        style={{ marginLeft: "5px", background: "blue", color: "white" }}
                      >
                        Restock
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;