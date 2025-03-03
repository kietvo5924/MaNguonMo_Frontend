import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

const AdminPage = () => {
    const navigate = useNavigate();
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    useEffect(() => {
        if (!user) {
            navigate("/login"); // Nếu không có user thì chuyển tới login
        } else if (user.roles.includes("ADMIN") || user.roles.includes("NHAN_VIEN")) {
            // Nếu là ADMIN hoặc NHAN_VIEN, hiển thị trang Admin
            return;
        } else {
            // Nếu không phải ADMIN hay NHAN_VIEN, điều hướng về trang Home
            navigate("/home");
        }
    }, [user, navigate]);

    if (!user) return null; // Tránh render khi chưa có user

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Chào mừng {user.username}, bạn có quyền quản trị.</p>
            <LogoutButton />
        </div>
    );
};

export default AdminPage;
