import axios from "axios";

const API_URL = "http://localhost:8080/api/auth"; // Thay đổi nếu cần

export const register = async (data) => {
    return axios.post(`${API_URL}/register`, data);
};

export const login = async (data) => {
    return axios.post(`${API_URL}/login`, data);
};
