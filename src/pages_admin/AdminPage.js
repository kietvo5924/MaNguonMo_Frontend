import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";  // Assuming you have a LogoutButton component
import RequireAuth from "../components/RequireAuth";  // Import the RequireAuth component

const AdminPage = () => {
    return (
        <RequireAuth roles={["ADMIN", "NHAN_VIEN"]}>
            <div className="admin-container">
                <h1 className="admin-title">Admin Dashboard</h1>
                <p className="admin-welcome">Chào mừng, bạn có quyền quản trị.</p>

                <div className="admin-menu">
                    <ul>
                        <li>
                            <Link className="admin-link" to="/admin/categories">Quản lý Danh mục</Link>
                        </li>
                        <li>
                            <Link className="admin-link" to="/admin/users">Quản lý Người dùng</Link>
                        </li>
                        <li>
                            <Link className="admin-link" to="/admin/orders">Quản lý Đơn hàng</Link>
                        </li>
                        <li>
                            <Link className="admin-link" to="/admin/products/">Quản lý Sản phẩm</Link> {/* Link to view products page */}
                        </li>
                    </ul>
                </div>

                <LogoutButton className="admin-logout" />
            </div>
        </RequireAuth>
    );
};

export default AdminPage;
