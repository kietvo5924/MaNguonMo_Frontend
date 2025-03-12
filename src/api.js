import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

// Gửi yêu cầu đăng ký
export const register = async (data) => {
    return axios.post(`${API_URL}/register`, data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json" // Thêm header Accept
        },
        withCredentials: true, // Cho phép gửi cookie/session
    });
};

// Gửi yêu cầu đăng nhập
export const login = async (data) => {
    return axios.post(`${API_URL}/login`, data, { withCredentials: true });
};
