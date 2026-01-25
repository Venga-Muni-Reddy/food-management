import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "./MyFoods.css";
import { useNavigate } from "react-router-dom";

export default function MyFoods() {
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMyFoods = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/foods/mine");
      setFoods(res.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch foods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyFoods();
  }, []);

  const getStatusClass = (status) => {
    if (status === "AVAILABLE") return "status available";
    if (status === "ACCEPTED") return "status accepted";
    if (status === "COMPLETED") return "status completed";
    if (status === "EXPIRED") return "status expired";
    if (status === "CANCELLED") return "status cancelled";
    return "status";
  };

  return (
    <div className="myfoods-page">
      <div className="myfoods-header">
        <h1>🍲 My Posted Foods</h1>
        <div className="actions">
          <button className="btn secondary" onClick={() => navigate("/")}>
            ← Back
          </button>
          <button className="btn primary" onClick={fetchMyFoods}>
            Refresh
          </button>
        </div>
      </div>

      {loading && <p className="info-text">Loading your foods...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && foods.length === 0 && !error && (
        <div className="empty-box">
          <h3>No foods posted yet</h3>
          <p>Post some extra food and help nearby people ❤️</p>
          <button className="btn primary" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </button>
        </div>
      )}

      <div className="foods-grid">
        {foods.map((food) => (
          <div key={food._id} className="food-card">
            <div className="food-top">
              <h3 className="food-title">{food.title}</h3>
              <span className={getStatusClass(food.status)}>{food.status}</span>
            </div>

            <p className="food-desc">
              {food.description ? food.description : "No description"}
            </p>

            <div className="food-info">
              <div>
                <span className="label">Quantity:</span>{" "}
                <b>
                  {food.quantity} {food.unit}
                </b>
              </div>
              <div>
                <span className="label">Food Type:</span> <b>{food.foodType}</b>
              </div>
              <div>
                <span className="label">Pickup:</span>{" "}
                <b>{food.pickupAddress}</b>
              </div>
              <div>
                <span className="label">Expires:</span>{" "}
                <b>{new Date(food.expiresAt).toLocaleString()}</b>
              </div>
            </div>

            <div className="food-footer">
              <small>
                Posted on: {new Date(food.createdAt).toLocaleString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
