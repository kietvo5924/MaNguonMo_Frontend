import React, { useEffect, useState } from "react";
import axios from "axios";
import RequireAuth from "../components/RequireAuth";  // Ensure this is imported

// Common Error Display Component
const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return <p style={{ color: "red" }}>{message}</p>;
};

// Common Category Input Form Component
const CategoryForm = ({
    category,
    onChange,
    onSubmit,
    isLoading,
    buttonText,
}) => (
    <div>
        <input
            type="text"
            name="name"
            value={category.name}
            onChange={onChange}
            placeholder="Tên danh mục"
            disabled={isLoading} // Disable input when loading
        />
        <textarea
            name="description"
            value={category.description}
            onChange={onChange}
            placeholder="Mô tả"
            disabled={isLoading} // Disable textarea when loading
        />
        <button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : buttonText}
        </button>
    </div>
);

const API_URL = "http://localhost:8080/admin/categories";

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState({ name: "", description: "" });
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // State to hold error message

    // Fetch categories when the component mounts
    useEffect(() => {
        setLoading(true);
        axios
            .get(API_URL, { withCredentials: true })
            .then((response) => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Lỗi khi lấy danh mục.");
                setLoading(false);
            });
    }, []);

    // Handle changes in input fields
    const handleCategoryChange = (e) => {
        setCategory({ ...category, [e.target.name]: e.target.value });
    };

    // Add a new category
    const handleAddCategory = () => {
        setLoading(true);
        axios
            .post(API_URL, category, { withCredentials: true })
            .then((response) => {
                setCategories([...categories, response.data]);
                setCategory({ name: "", description: "" });
                setLoading(false);
            })
            .catch(() => {
                setError("Lỗi khi thêm danh mục.");
                setLoading(false);
            });
    };

    // Edit an existing category
    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setCategory({ name: category.name, description: category.description });
    };

    // Update an existing category
    const handleUpdateCategory = () => {
        setLoading(true);
        axios
            .put(`${API_URL}/${editingCategory.id}`, category, { withCredentials: true })
            .then((response) => {
                const updatedCategories = categories.map((cat) =>
                    cat.id === editingCategory.id ? response.data : cat
                );
                setCategories(updatedCategories);
                setCategory({ name: "", description: "" });
                setEditingCategory(null);
                setLoading(false);
            })
            .catch(() => {
                setError("Lỗi khi cập nhật danh mục.");
                setLoading(false);
            });
    };

    // Delete a category
    const handleDeleteCategory = (id) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa danh mục này?");
        if (confirmDelete) {
            setLoading(true);
            axios
                .delete(`${API_URL}/${id}`, { withCredentials: true })
                .then(() => {
                    setCategories(categories.filter((category) => category.id !== id));
                    setLoading(false);
                })
                .catch(() => {
                    setError("Lỗi khi xóa danh mục.");
                    setLoading(false);
                });
        }
    };

    return (
        <RequireAuth roles={["ADMIN", "NHAN_VIEN"]}>
            <div>
                <h2>Quản Lý Danh Mục</h2>

                {/* Display error message if there is any */}
                <ErrorMessage message={error} />

                {/* Category Form */}
                <CategoryForm
                    category={category}
                    onChange={handleCategoryChange}
                    onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
                    isLoading={loading}
                    buttonText={editingCategory ? "Cập nhật" : "Thêm mới"}
                />

                {loading && <p>Đang tải dữ liệu...</p>} {/* Show loading indicator */}

                {/* Category List */}
                <ul>
                    {categories.map((cat) => (
                        <li key={cat.id}>
                            <span>{cat.name} - {cat.description}</span>
                            <button onClick={() => handleEditCategory(cat)} disabled={loading}>
                                Sửa
                            </button>
                            <button onClick={() => handleDeleteCategory(cat.id)} disabled={loading}>
                                Xóa
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </RequireAuth>
    );
};

export default CategoryManagement;
