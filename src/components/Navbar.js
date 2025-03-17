import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../App.css";

const Navbar = () => {
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
    <>{
      !location.pathname.startsWith("/admin") && (
        <nav className="navbar navbar-expand-lg navbar-custom">
          <div className="container">
            <Link className="navbar-brand navbar-title" to="/">
              MyTechSite
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link navbar-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link navbar-link" to="/about">About</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link navbar-link" to="/contact">Contact</Link>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto">
                {user ? (
                  <>
                    <li className="nav-item">
                      <span className="nav-link navbar-link">{user.username}</span>
                    </li>
                    <li className="nav-item">
                      <button className="nav-link navbar-link btn btn-link" onClick={handleLogout}>Đăng xuất</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link navbar-link" to="/login">Đăng nhập</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link navbar-link" to="/register">Đăng ký</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      )
    }</>
  );
};

export default Navbar;
