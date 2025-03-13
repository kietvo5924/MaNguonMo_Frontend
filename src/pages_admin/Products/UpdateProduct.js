import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import RequireAuth from '../../components/RequireAuth';

const UpdateProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0,
        stockQuantity: 0,
        imageUrl: "",
        categoryId: 1,
        versions: [
            {
                id: null,
                versionName: "",
                extraPrice: 0,
                colors: [{ id: null, colorName: "", colorCode: "" }]
            }
        ]
    });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    // Load product data
    useEffect(() => {
        axios
            .get(`http://localhost:8080/admin/products/${id}`)
            .then((response) => {
                setProduct(response.data);
                setIsLoading(false);
            })
            .catch(() => {
                alert("Lỗi khi tải sản phẩm!");
                setIsLoading(false);
            });
    }, [id]);

    const handleInputChange = (e, versionIndex = 0, colorIndex = 0) => {
        const { name, value } = e.target;
        const updatedProduct = { ...product };

        // Check for fields directly on the product
        if (
            name === "name" ||
            name === "description" ||
            name === "price" ||
            name === "stockQuantity" ||
            name === "imageUrl" ||
            name === "categoryId"
        ) {
            updatedProduct[name] = value;
        }
        // Check for fields in the versions
        else if (name === "versionName" || name === "extraPrice") {
            updatedProduct.versions[versionIndex][name] = value;
        }
        // Check for color fields using version and color indices
        else if (name.startsWith("colorName") || name.startsWith("colorCode")) {
            // Split to extract versionIndex and colorIndex
            const nameParts = name.split("-");
            const versionIdx = parseInt(nameParts[1]);
            const colorIdx = parseInt(nameParts[2]);

            if (nameParts[0] === "colorName") {
                updatedProduct.versions[versionIdx].colors[colorIdx].colorName = value;
            } else if (nameParts[0] === "colorCode") {
                updatedProduct.versions[versionIdx].colors[colorIdx].colorCode = value;
            }
        }

        setProduct(updatedProduct);
    };

    const handleSubmit = () => {
        setIsLoading(true);

        // Update product information
        axios
            .put(
                `http://localhost:8080/admin/products/${id}`,
                {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stockQuantity: product.stockQuantity,
                    imageUrl: product.imageUrl,
                    categoryId: product.categoryId
                },
                { withCredentials: true }
            )
            .then(() => {
                // Update versions information
                const updateVersionRequests = product.versions.map((version) =>
                    axios.put(
                        `http://localhost:8080/admin/products/versions/${version.id}`,
                        {
                            versionName: version.versionName,
                            extraPrice: version.extraPrice
                        },
                        { withCredentials: true }
                    )
                );

                // Update colors information for each version
                const updateColorRequests = product.versions.map((version) =>
                    version.colors.map((color) =>
                        axios.put(
                            `http://localhost:8080/admin/products/colors/${color.id}`,
                            {
                                colorName: color.colorName,
                                colorCode: color.colorCode
                            },
                            { withCredentials: true }
                        )
                    )
                );

                // Wait for all version and color updates to complete
                Promise.all([
                    ...updateVersionRequests,
                    ...updateColorRequests.flat()
                ])
                    .then(() => {
                        alert("Sản phẩm đã được cập nhật!");
                        navigate("/admin/products/view");
                    })
                    .catch(() => {
                        alert("Lỗi khi cập nhật các phiên bản hoặc màu sắc sản phẩm!");
                        setIsLoading(false);
                    });
            })
            .catch(() => {
                alert("Lỗi khi cập nhật sản phẩm!");
                setIsLoading(false);
            });
    };

    return (
        <RequireAuth roles={["ADMIN", "NHAN_VIEN"]}>
            <div>
                <h2>Chỉnh sửa sản phẩm</h2>

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

                {/* Versions Section */}
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

                        {/* Colors Section */}
                        {version.colors.map((color, colorIndex) => (
                            <div key={colorIndex}>
                                <input
                                    type="text"
                                    name={`colorName-${versionIndex}-${colorIndex}`}  // Unique name for color name
                                    value={color.colorName}
                                    onChange={(e) => handleInputChange(e, versionIndex, colorIndex)}
                                    placeholder="Tên màu"
                                    disabled={isLoading}
                                />
                                <input
                                    type="text"
                                    name={`colorCode-${versionIndex}-${colorIndex}`}  // Unique name for color code
                                    value={color.colorCode}
                                    onChange={(e) => handleInputChange(e, versionIndex, colorIndex)}
                                    placeholder="Mã màu"
                                    disabled={isLoading}
                                />
                            </div>
                        ))}
                    </div>
                ))}

                <button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "Đang xử lý..." : "Cập nhật sản phẩm"}
                </button>
            </div>
        </RequireAuth>
    );
};

export default UpdateProduct;
