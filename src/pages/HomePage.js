import React from "react";
import LogoutButton from "../components/LogoutButton";

const HomePage = () => {
    return (
        <div>
            <h1>Trang chủ</h1>
            <p>Chào mừng bạn đến với hệ thống quản lý thiết bị điện tử.</p>
            <LogoutButton />
        </div>
    );
};

export default HomePage;
