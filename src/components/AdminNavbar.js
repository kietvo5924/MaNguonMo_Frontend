import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../App.css";

const AdminNavbar = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (!location.pathname.startsWith("/admin")) {
    return null; // Không hiển thị AdminNavbar trên trang thường
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Logout failed");

      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-light">
      <div className="container">
        <Link className="navbar-brand navbar-title" to="/admin">
          Admin Panel
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="adminNavbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link navbar-link" to="/admin/categories">
                Danh mục
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link navbar-link" to="/admin/users">
                Người dùng
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link navbar-link" to="/admin/orders">
                Đơn hàng
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link navbar-link" to="/admin/products">
                Sản phẩm
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <span className="nav-link navbar-link text-light">
                Admin: {user.username}
              </span>
            </li>
            <li className="nav-item">
              <button
                className="nav-link navbar-link btn btn-link text-light"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
