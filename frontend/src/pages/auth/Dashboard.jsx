import React, { useEffect, useMemo, useState } from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  

  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donateLoading, setDonateLoading] = useState(false);
  const [donateError, setDonateError] = useState("");

  const [foodForm, setFoodForm] = useState({
    title: "",
    description: "",
    quantity: "",
    unit: "plates",
    foodType: "VEG",
    expiresAt: "",
    pickupAddress: "",
    latitude: "",
    longitude: "",
  });

  const unreadCount = notifications.filter((n) => n.status === "UNREAD").length;

  const fetchNotifications = async () => {
    if (!isLoggedIn) return;
    try {
      setNotifLoading(true);
      const res = await api.get("/notifications");
      setNotifications(res.data?.data || []);
    } catch (err) {
      console.log(err?.response?.data?.message || err.message);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ✅ Accept food
  const handleAccept = async (notifId) => {
    try {
      await api.post(`/notifications/${notifId}/accept`);
      alert("✅ Food accepted successfully!");
      fetchNotifications();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to accept food");
    }
  };

  // ✅ Donate food submit
  const handleDonateSubmit = async (e) => {
    e.preventDefault();
    setDonateError("");

    try {
      setDonateLoading(true);

      const payload = {
        ...foodForm,
        quantity: Number(foodForm.quantity),
        latitude: Number(foodForm.latitude),
        longitude: Number(foodForm.longitude),
        expiresAt: new Date(foodForm.expiresAt).toISOString(),
        images: [],
      };

      await api.post("/foods", payload);

      alert("✅ Food posted successfully!");
      setShowDonateModal(false);

      // clear form
      setFoodForm({
        title: "",
        description: "",
        quantity: "",
        unit: "plates",
        foodType: "VEG",
        expiresAt: "",
        pickupAddress: "",
        latitude: "",
        longitude: "",
      });

      // refresh notifications (for receiver testing)
      fetchNotifications();
    } catch (err) {
      setDonateError(err?.response?.data?.message || "Failed to post food");
    } finally {
      setDonateLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const [count,setCount]=useState(0);

    useEffect(
    () =>{
      console.log("This block executing");
      return ()=>{
      console.log("This executes while component changes");
    }},
    [count]
  )


  return (
    <div>
      {/* ✅ NAVBAR */}
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          FoodShare
        </div>

        <ul className="nav-links">
          <li onClick={() => document.getElementById("about").scrollIntoView()}>
            About
          </li>
          <li onClick={() => document.getElementById("how").scrollIntoView()}>
            How It Works
          </li>
          <li onClick={() => document.getElementById("contact").scrollIntoView()}>
            Contact
          </li>
          <li>
          <button className="nav-btn" onClick={() => navigate("/myfoods")}>
            📦 My Foods
          </button>
        </li>

          {!isLoggedIn ? (
            <>
              <li>
                <button className="nav-btn" onClick={() => navigate("/login")}>
                  Login
                </button>
              </li>
              <li>
                <button className="nav-btn" onClick={() => navigate("/register")}>
                  Register
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button className="nav-btn donate-btn" onClick={() => setShowDonateModal(true)}>
                  + Donate Food
                </button>
              </li>

              {/* ✅ Notification Button */}
              <li>
                <button className="nav-btn notif-btn" onClick={fetchNotifications}>
                  🔔 Notifications
                  {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                </button>
              </li>

              <li>
                <button className="nav-btn logout-btn" onClick={logout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* ✅ HERO SECTION */}
      <section className="hero">
        <h1>Stop Food Wastage, Feed People ✅</h1>
        <p>
          Post extra food and nearby hungry people will get notified instantly in the app.
        </p>


        {!isLoggedIn ? (
          <button className="hero-btn" onClick={() => navigate("/register")}>
            Join Now
          </button>
        ) : (
          <button className="hero-btn" onClick={() => setShowDonateModal(true)}>
            Donate Food Now
          </button>
        )}
      </section>

      {/* ✅ Notifications Section */}
      {isLoggedIn && (
        <section className="notifications-section">
          <h2>
            Nearby Food Notifications{" "}
            {notifLoading ? <span className="small">(Loading...)</span> : null}
          </h2>

          {notifications.length === 0 ? (
            <p className="empty-text">No notifications yet. Wait for nearby food posts.</p>
          ) : (
            <div className="notif-list">
              {notifications.map((n) => (
                <div className="notif-card" key={n._id}>
                  <div className="notif-left">
                    <p className="notif-msg">{n.message}</p>
                    <p className="notif-meta">
                      Status: <b>{n.status}</b>
                    </p>

                    {n.foodId && (
                      <p className="notif-meta">
                        Food: <b>{n.foodId.title}</b> | Qty:{" "}
                        <b>{n.foodId.quantity}</b>
                      </p>
                    )}
                  </div>

                  <div className="notif-right">
                    {n.status === "UNREAD" || n.status === "READ" ? (
                      <button className="accept-btn" onClick={() => handleAccept(n._id)}>
                        Accept
                      </button>
                    ) : (
                      <button className="disabled-btn" disabled>
                        {n.status}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ✅ ABOUT */}
      <section className="about" id="about">
        <h2>About FoodShare</h2>
        <p>
          Many people waste food every day, while many others sleep hungry.
          This platform connects donors and people nearby who need food.
        </p>
      </section>

      {/* ✅ HOW IT WORKS */}
      <section className="services" id="how">
        <h2>How It Works</h2>
        <div className="service-cards">
          <div className="service-card">✅ Register & Save Location</div>
          <div className="service-card">🍲 Donate Extra Food</div>
          <div className="service-card">🔔 Nearby People Get Notified</div>
          <div className="service-card">🤝 Accept & Collect Food</div>
        </div>
      </section>
      

      {/* ✅ CONTACT */}
      <section className="contact" id="contact">
        <h2>Contact Us</h2>
        <p>Email: support@foodshare.com</p>
        <p>Phone: +91 98765 43210</p>
        <p>Address: India</p>
      </section>
      <button onClick={()=> setCount(count+1)}>Increment</button>

      <h1>Count {count}</h1>

      <button onClick={()=> setCount(count-1)}>Decrement</button>

      {/* ✅ FOOTER */}
      <footer className="footer">
        <p>© 2026 FoodShare. All rights reserved.</p>
      </footer>

      {/* ✅ Donate Modal */}
      {showDonateModal && (
        <div className="modal-overlay" onClick={() => setShowDonateModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Donate Food 🍲</h2>

            <form onSubmit={handleDonateSubmit} className="donate-form">
              <input
                placeholder="Food Title (ex: Idli)"
                value={foodForm.title}
                onChange={(e) => setFoodForm({ ...foodForm, title: e.target.value })}
                required
              />

              <input
                placeholder="Pickup Address (ex: Ameerpet Metro)"
                value={foodForm.pickupAddress}
                onChange={(e) => setFoodForm({ ...foodForm, pickupAddress: e.target.value })}
                required
              />

              <input
                placeholder="Description"
                value={foodForm.description}
                onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
              />

              <div className="row">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={foodForm.quantity}
                  onChange={(e) => setFoodForm({ ...foodForm, quantity: e.target.value })}
                  required
                />
                <select
                  value={foodForm.foodType}
                  onChange={(e) => setFoodForm({ ...foodForm, foodType: e.target.value })}
                >
                  <option value="VEG">VEG</option>
                  <option value="NON_VEG">NON_VEG</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>

              <input
                type="datetime-local"
                value={foodForm.expiresAt}
                onChange={(e) => setFoodForm({ ...foodForm, expiresAt: e.target.value })}
                required
              />

              <div className="row">
                <input
                  placeholder="Latitude"
                  value={foodForm.latitude}
                  onChange={(e) => setFoodForm({ ...foodForm, latitude: e.target.value })}
                  required
                />
                <input
                  placeholder="Longitude"
                  value={foodForm.longitude}
                  onChange={(e) => setFoodForm({ ...foodForm, longitude: e.target.value })}
                  required
                />
              </div>

              {donateError && <p className="error-text">{donateError}</p>}

              <button className="submit-btn" type="submit" disabled={donateLoading}>
                {donateLoading ? "Posting..." : "Post Food"}
              </button>

              <button
                className="cancel-btn"
                type="button"
                onClick={() => setShowDonateModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
