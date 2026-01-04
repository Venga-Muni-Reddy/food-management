import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

const PrivateRoute = ({ children }) => {
  const { isAuth, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuth ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <h1 className="text-xl">Dashboard</h1>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
