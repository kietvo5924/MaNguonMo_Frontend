import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import axios from "axios"; // Thêm import axios để sử dụng cho kiểm tra session

const LoginPage = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gửi yêu cầu đăng nhập
            const response = await login(form);

            // Lưu thông tin người dùng vào localStorage (nếu cần)
            localStorage.setItem("user", JSON.stringify(response.data));

            // Kiểm tra session
            const sessionResponse = await axios.get("http://localhost:8080/api/auth/check-session", { withCredentials: true });
            console.log(sessionResponse.data); // In ra thông tin session trong console

            alert("Đăng nhập thành công!");
            navigate("/home"); // Điều hướng tới trang chủ
        } catch (error) {
            alert("Đăng nhập thất bại!");
        }
    };

    return (
        <div>
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Tên đăng nhập"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    onChange={handleChange}
                    required
                />
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
};

export default LoginPage;
