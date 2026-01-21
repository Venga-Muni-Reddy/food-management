import React from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">MyApp</div>
        <ul className="nav-links">
          <li>Home</li>
          <li>About</li>
          <li>Services</li>
          <li>Contact</li>
          <li><button onClick={() => navigate("/login")}>Login</button></li>
          <li><button onClick={() => navigate("/register")}>Register</button></li>
          <li>
            <button onClick={()=>{
             navigate("/profile");
            }}>
              Profile
            </button>
          </li>

        </ul>

      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to My Dashboard</h1>
        <p>Manage everything easily from one place</p>
        <button>Get Started</button>
      </section>


      {/* About Section */}
      <section className="about">
        <h2>About Us</h2>
        <p>This application helps you manage users, services, and orders easily.</p>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="service-cards">
          <div className="service-card">Fast Service</div>
          <div className="service-card">Secure Data</div>
          <div className="service-card">24/7 Support</div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products">
        <h2>Products</h2>
        <p>Food Items / Services / Images</p>
      </section>

      {/* Contact Section */}
      <section className="contact">
        <h2>Contact Us</h2>
        <p>Email: support@myapp.com</p>
        <p>Phone: +91 98765 43210</p>
        <p>Address: India</p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 MyApp. All rights reserved.</p>
        <div className="social-links">
          <span>Facebook</span>
          <span>Instagram</span>
          <span>Twitter</span>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
