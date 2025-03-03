import React, { useState } from "react";
import { register } from "../api";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        email: "",
        fullName: "",
        phoneNumber: "",
        address: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(form);
            alert("Đăng ký thành công!");
            navigate("/login");
        } catch (error) {
            alert("Đăng ký thất bại!");
        }
    };

    return (
        <div>
            <h2>Đăng ký</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Tên đăng nhập" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="text" name="fullName" placeholder="Họ và tên" onChange={handleChange} required />
                <input type="text" name="phoneNumber" placeholder="Số điện thoại" onChange={handleChange} required />
                <input type="text" name="address" placeholder="Địa chỉ" onChange={handleChange} required />
                <button type="submit">Đăng ký</button>
            </form>
        </div>
    );
};

export default RegisterPage;
