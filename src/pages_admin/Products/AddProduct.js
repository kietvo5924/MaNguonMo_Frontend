import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RequireAuth from '../../components/RequireAuth';

const AddProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0,
        stockQuantity: 0,
        imageUrl: "",
        categoryId: 1,
        versions: [
            {
                versionName: "",
                extraPrice: 0,
                colors: [{ colorName: "", colorCode: "" }]
            }
        ]
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e, versionIndex = 0, colorIndex = 0) => {
        const { name, value } = e.target;
        const updatedProduct = { ...product };

        if (name === "name" || name === "description" || name === "price" || name === "stockQuantity" || name === "imageUrl" || name === "categoryId") {
            updatedProduct[name] = value;
        } else if (name === "versionName" || name === "extraPrice") {
            updatedProduct.versions[versionIndex][name] = value;
        } else if (name.startsWith("color")) {
            const colorKey = name.split('-')[0];
            updatedProduct.versions[versionIndex].colors[colorIndex][colorKey] = value;
        }

        setProduct(updatedProduct);
    };

    const addVersion = () => {
        const updatedProduct = { ...product };
        updatedProduct.versions.push({
            versionName: "",
            extraPrice: 0,
            colors: [{ colorName: "", colorCode: "" }]
        });
        setProduct(updatedProduct);
    };

    const removeVersion = (versionIndex) => {
        const updatedProduct = { ...product };
        updatedProduct.versions.splice(versionIndex, 1);
        setProduct(updatedProduct);
    };

    const addColor = (versionIndex) => {
        const updatedProduct = { ...product };
        updatedProduct.versions[versionIndex].colors.push({
            colorName: "",
            colorCode: ""
        });
        setProduct(updatedProduct);
    };

    const removeColor = (versionIndex, colorIndex) => {
        const updatedProduct = { ...product };
        updatedProduct.versions[versionIndex].colors.splice(colorIndex, 1);
        setProduct(updatedProduct);
    };

    const handleSubmit = () => {
        setIsLoading(true);
        axios
            .post("http://localhost:8080/admin/products", product, { withCredentials: true })
            .then(() => {
                alert("Sản phẩm đã được thêm!");
                navigate("/admin/products/view");  // Chuyển đến trang /admin/products/view
            })
            .catch(() => {
                alert("Lỗi khi thêm sản phẩm!");
                setIsLoading(false);
            });
    };

    return (
        <RequireAuth roles={["ADMIN", "NHAN_VIEN"]}>
            <div>
                <h2>Thêm sản phẩm mới</h2>

                <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    placeholder="Tên sản phẩm"
                    disabled={isLoading}
                />
                <textarea
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    placeholder="Mô tả sản phẩm"
                    disabled={isLoading}
                />
                <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleInputChange}
                    placeholder="Giá sản phẩm"
                    disabled={isLoading}
                />
                <input
                    type="number"
                    name="stockQuantity"
                    value={product.stockQuantity}
                    onChange={handleInputChange}
                    placeholder="Số lượng tồn kho"
                    disabled={isLoading}
                />
                <input
                    type="text"
                    name="imageUrl"
                    value={product.imageUrl}
                    onChange={handleInputChange}
                    placeholder="URL ảnh sản phẩm"
                    disabled={isLoading}
                />
                <input
                    type="number"
                    name="categoryId"
                    value={product.categoryId}
                    onChange={handleInputChange}
                    placeholder="ID danh mục"
                    disabled={isLoading}
                />

                {/* Phần phiên bản */}
                {product.versions.map((version, versionIndex) => (
                    <div key={versionIndex}>
                        <h3>Phiên bản {versionIndex + 1}</h3>
                        <input
                            type="text"
                            name="versionName"
                            value={version.versionName}
                            onChange={(e) => handleInputChange(e, versionIndex)}
                            placeholder="Tên phiên bản"
                            disabled={isLoading}
                        />
                        <input
                            type="number"
                            name="extraPrice"
                            value={version.extraPrice}
                            onChange={(e) => handleInputChange(e, versionIndex)}
                            placeholder="Giá thêm"
                            disabled={isLoading}
                        />

                        {/* Phần màu sắc */}
                        {version.colors.map((color, colorIndex) => (
                            <div key={colorIndex}>
                                <input
                                    type="text"
                                    name={`colorName-${colorIndex}`}
                                    value={color.colorName}
                                    onChange={(e) => handleInputChange(e, versionIndex, colorIndex)}
                                    placeholder="Tên màu"
                                    disabled={isLoading}
                                />
                                <input
                                    type="text"
                                    name={`colorCode-${colorIndex}`}
                                    value={color.colorCode}
                                    onChange={(e) => handleInputChange(e, versionIndex, colorIndex)}
                                    placeholder="Mã màu"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeColor(versionIndex, colorIndex)}
                                    disabled={isLoading}
                                >
                                    Xóa màu
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addColor(versionIndex)}
                            disabled={isLoading}
                        >
                            Thêm màu
                        </button>
                        <button
                            type="button"
                            onClick={() => removeVersion(versionIndex)}
                            disabled={isLoading}
                        >
                            Xóa phiên bản
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addVersion}
                    disabled={isLoading}
                >
                    Thêm phiên bản
                </button>

                <button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "Đang xử lý..." : "Thêm sản phẩm"}
                </button>
            </div>
        </RequireAuth>
    );
};

export default AddProduct;
