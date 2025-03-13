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

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let formErrors = {};
        if (!form.username) formErrors.username = "Tên đăng nhập không được để trống";
        if (!form.password) formErrors.password = "Mật khẩu không được để trống";
        if (!form.email) formErrors.email = "Email không được để trống";
        if (!form.fullName) formErrors.fullName = "Họ và tên không được để trống";
        if (!form.phoneNumber) formErrors.phoneNumber = "Số điện thoại không được để trống";
        if (!form.address) formErrors.address = "Địa chỉ không được để trống";
        return formErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) {
            return;
        }

        setLoading(true);
        try {
            await register(form);
            alert("Đăng ký thành công!");
            navigate("/login");
        } catch (error) {
            const errorMessage = error.response?.data || error.message;
            alert("Đăng ký thất bại: " + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Đăng ký</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        name="username"
                        placeholder="Tên đăng nhập"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                    {errors.username && <span style={{ color: "red" }}>{errors.username}</span>}
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    {errors.password && <span style={{ color: "red" }}>{errors.password}</span>}
                </div>
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
                </div>
                <div>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Họ và tên"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                    />
                    {errors.fullName && <span style={{ color: "red" }}>{errors.fullName}</span>}
                </div>
                <div>
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Số điện thoại"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                    {errors.phoneNumber && <span style={{ color: "red" }}>{errors.phoneNumber}</span>}
                </div>
                <div>
                    <input
                        type="text"
                        name="address"
                        placeholder="Địa chỉ"
                        value={form.address}
                        onChange={handleChange}
                        required
                    />
                    {errors.address && <span style={{ color: "red" }}>{errors.address}</span>}
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
