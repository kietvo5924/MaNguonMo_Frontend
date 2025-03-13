import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";  // Assuming you have a LogoutButton component
import RequireAuth from "../components/RequireAuth";  // Import the RequireAuth component

const AdminPage = () => {
    return (
        <RequireAuth roles={["ADMIN", "NHAN_VIEN"]}>
            <div>
                <h1>Admin Dashboard</h1>
                <p>Chào mừng, bạn có quyền quản trị.</p>

                <div>
                    <ul>
                        <li>
                            <Link to="/admin/categories">Quản lý Danh mục</Link>
                        </li>
                        <li>
                            <Link to="/admin/users">Quản lý Người dùng</Link>
                        </li>
                        <li>
                            <Link to="/admin/orders">Quản lý Đơn hàng</Link>
                        </li>
                        <li>
                            <Link to="/admin/products/view">Quản lý Sản phẩm</Link> {/* Link to view products page */}
                        </li>
                    </ul>
                </div>

                <LogoutButton />
            </div>
        </RequireAuth>
    );
};

export default AdminPage;
