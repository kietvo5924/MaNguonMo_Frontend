import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.css";
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
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4 login-card">
                <h2 className="text-center login-title">Đăng nhập</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input 
                            type="text" 
                            name="username" 
                            className="form-control login-input" 
                            placeholder="Tên đăng nhập" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <input 
                            type="password" 
                            name="password" 
                            className="form-control login-input" 
                            placeholder="Mật khẩu" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn login-button w-100">Đăng nhập</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
