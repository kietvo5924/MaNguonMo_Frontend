import axios from "axios";

const API_URL = "http://localhost:8080/api/auth"; // Thay đổi nếu cần

// Gửi yêu cầu đăng ký
export const register = async (data) => {
    return axios.post(`${API_URL}/register`, data); // Gửi yêu cầu POST đến /register
};

// Gửi yêu cầu đăng nhập
export const login = async (data) => {
    return axios.post(`${API_URL}/login`, data, { withCredentials: true }); // Thêm withCredentials ở đây
};

