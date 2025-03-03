import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

const LoginPage = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(form);
            localStorage.setItem("user", JSON.stringify(response.data)); // Lưu user vào localStorage
            alert("Đăng nhập thành công!");
            navigate("/home");
        } catch (error) {
            alert("Đăng nhập thất bại!");
        }
    };

    return (
        <div>
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Tên đăng nhập" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required />
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
};

export default LoginPage;
