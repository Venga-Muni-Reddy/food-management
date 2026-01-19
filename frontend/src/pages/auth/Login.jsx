import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./login.css";

export default function Login() {
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);

  const canSubmit = useMemo(() => {
    return (
      form.email.trim() &&
      form.password.trim().length >= 6 &&
      isValidEmail(form.email.trim())
    );
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background decorative blob */}
      <div className="login-bg" aria-hidden="true" />

      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-dot" />
              <span className="logo-text">MyApp</span>
            </div>

            <h1 className="login-title">Welcome Back 👋</h1>
            <p className="login-subtitle">
              Login to continue and manage your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Email */}
            <div className="field">
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <div className="input-wrap">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="field-input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="field">
              <label className="field-label" htmlFor="password">
                Password
              </label>

              <div className="input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="field-input"
                />

                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass((s) => !s)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>

              <div className="helper-row">
                <div className="remember">
                  <input id="remember" type="checkbox" />
                  <label htmlFor="remember">Remember me</label>
                </div>

                <button
                  type="button"
                  className="forgot-btn"
                  onClick={() =>
                    alert("Integrate Forgot Password API / page here ✅")
                  }
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Error */}
            {error && <div className="error-box">{error}</div>}

            {/* Submit */}
            <button
              type="submit"
              className={`login-btn ${loading ? "loading" : ""}`}
              disabled={!canSubmit || loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            {/* Optional social login button UI */}
            <button
              type="button"
              className="google-btn"
              onClick={() => alert("Integrate Google OAuth here ✅")}
            >
              <span className="google-icon">G</span>
              Continue with Google
            </button>

            <p className="signup-text">
              Don’t have an account?{" "}
              <span
                className="signup-link"
                onClick={() => alert("Navigate to Signup page ✅")}
              >
                Create one
              </span>
            </p>
          </form>
        </div>

        <footer className="login-footer">
          © {new Date().getFullYear()} MyApp. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
