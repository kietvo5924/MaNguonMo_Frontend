import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "reactstrap";
import RequireAuth from '../../components/RequireAuth';

const ViewCategory = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8080/admin/categories")
            .then(response => {
                setCategories(response.data);
            })
            .catch(() => {
                alert("Lỗi khi tải danh mục!");
            });
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
            axios.delete(`http://localhost:8080/admin/categories/${id}`, { withCredentials: true })
                .then(() => {
                    alert("Danh mục đã được xóa!");
                    setCategories(categories.filter(category => category.id !== id));
                })
                .catch(() => {
                    alert("Lỗi khi xóa danh mục!");
                });
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/categories/update/${id}`);
    };

    const handleAddCategory = () => {
        navigate("/admin/categories/add");
    };

    return (
        <RequireAuth roles={["ADMIN", "NHAN_VIEN"]}>
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Danh sách Danh mục</h2>
                    <Button color="primary" onClick={handleAddCategory}>Thêm danh mục</Button>
                </div>
                <Table bordered>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên danh mục</th>
                            <th>Mô tả</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                            <tr><td colSpan="4" className="text-center">Chưa có danh mục nào!</td></tr>
                        ) : (
                            categories.map((category, index) => (
                                <tr key={category.id}>
                                    <td>{index + 1}</td>
                                    <td>{category.name}</td>
                                    <td>{category.description}</td>
                                    <td>
                                        <Button color="info" size="sm" className="me-2" onClick={() => handleEdit(category.id)}>Chỉnh sửa</Button>
                                        <Button color="danger" size="sm" onClick={() => handleDelete(category.id)}>Xóa</Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>
        </RequireAuth>
    );
};

export default ViewCategory;
