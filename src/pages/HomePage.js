import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.css";

const HomePage = () => {
    return (
        <div className="home-container">
            <div className="content-box">
                <h1 className="home-title">Trang chủ</h1>
                <p className="home-text">Chào mừng bạn đến với hệ thống quản lý thiết bị điện tử.</p>
            </div>
        </div>
    );
};

export default HomePage;
