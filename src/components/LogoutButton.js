import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const navigate = useNavigate();
    const user = localStorage.getItem("user"); // Kiểm tra user

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) throw new Error("Logout failed");

            localStorage.removeItem("user"); // Xoá user khỏi localStorage
            navigate("/login"); // Chuyển về trang đăng nhập
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Nếu chưa đăng nhập, không hiển thị nút logout
    if (!user) return null;

    return (
        <button className="btn logout-button w-100" onClick={handleLogout}>
            Đăng Xuất
        </button>
    );
};

export default LogoutButton;
