import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RequireAuth from '../../components/RequireAuth';

const ViewProduct = () => {
    const [products, setProducts] = useState([]); // Store all products
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all products
        axios
            .get("http://localhost:8080/admin/products") // Assuming this endpoint returns all products
            .then(response => {
                setProducts(response.data);
            })
            .catch(() => {
                alert("Lỗi khi tải sản phẩm!");
            });
    }, []); // Run only once when the component mounts

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            axios
                .delete(`http://localhost:8080/admin/products/${id}`, { withCredentials: true })
                .then(() => {
                    alert("Sản phẩm đã được xóa!");
                    // Reload the page to update the product list
                    window.location.reload();
                })
                .catch(() => {
                    alert("Lỗi khi xóa sản phẩm!");
                });
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/products/update/${id}`); // Navigate to the product update page
    };

    const handleAddProduct = () => {
        navigate("/admin/products/add"); // Navigate to the add product page
    };

    return (
        <RequireAuth roles={["ADMIN", "NHAN_VIEN"]}>
            <div>
                <h2>Danh sách Sản phẩm</h2>
                <button onClick={handleAddProduct}>
                    Thêm sản phẩm
                </button>
                <div>
                    {products.length === 0 ? (
                        <p>Chưa có sản phẩm nào!</p>
                    ) : (
                        <ul>
                            {products.map((product) => (
                                <li key={product.id}>
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <p>Giá: {product.price}</p>
                                    <p>Số lượng tồn kho: {product.stockQuantity}</p>
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        style={{ width: "200px" }}
                                    />
                                    <div>
                                        <button
                                            onClick={() => handleEdit(product.id)}
                                        >
                                            Chỉnh sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </RequireAuth>
    );
};

export default ViewProduct;
