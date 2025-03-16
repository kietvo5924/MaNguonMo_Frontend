import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "reactstrap";
import RequireAuth from '../../components/RequireAuth';

const ViewProduct = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8080/admin/products")
            .then(response => {
                setProducts(response.data);
            })
            .catch(() => {
                alert("Lỗi khi tải sản phẩm!");
            });
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            axios.delete(`http://localhost:8080/admin/products/${id}`, { withCredentials: true })
                .then(() => {
                    alert("Sản phẩm đã được xóa!");
                    setProducts(products.filter(product => product.id !== id));
                })
                .catch(() => {
                    alert("Lỗi khi xóa sản phẩm!");
                });
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/products/update/${id}`);
    };

    const handleAddProduct = () => {
        navigate("/admin/products/add");
    };

    return (
        <RequireAuth roles={["ADMIN", "NHAN_VIEN"]}>
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Danh sách Sản phẩm</h2>
                    <Button color="primary" onClick={handleAddProduct}>Thêm sản phẩm</Button>
                </div>
                <Table bordered>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên sản phẩm</th>
                            <th>Mô tả</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Hình ảnh</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr><td colSpan="7" className="text-center">Chưa có sản phẩm nào!</td></tr>
                        ) : (
                            products.map((product, index) => (
                                <tr key={product.id}>
                                    <td>{index + 1}</td>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.price}</td>
                                    <td>{product.stockQuantity}</td>
                                    <td>
                                        <img src={product.imageUrl} alt={product.name} style={{ width: "50px" }} />
                                    </td>
                                    <td>
                                        <Button color="info" size="sm" className="me-2" onClick={() => handleEdit(product.id)}>Chỉnh sửa</Button>
                                        <Button color="danger" size="sm" onClick={() => handleDelete(product.id)}>Xóa</Button>
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

export default ViewProduct;
