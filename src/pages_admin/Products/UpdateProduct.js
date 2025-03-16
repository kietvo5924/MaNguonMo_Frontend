import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Row, Col } from "reactstrap";
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

    useEffect(() => {
        axios
            .get(`http://localhost:8080/admin/products/${id}`, { withCredentials: true })
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
        else if (name === "versionName" || name === "extraPrice") {
            updatedProduct.versions[versionIndex][name] = value;
        }
        else if (name.startsWith("colorName") || name.startsWith("colorCode")) {
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

                Promise.all([...updateVersionRequests, ...updateColorRequests.flat()])
                    .then(() => {
                        alert("Sản phẩm đã được cập nhật!");
                        navigate("/admin/products");
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
            <div className="container mt-4">
                <h2>Chỉnh sửa sản phẩm</h2>
                <Form>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="name">Tên sản phẩm</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={handleInputChange}
                                    placeholder="Tên sản phẩm"
                                    disabled={isLoading}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="price">Giá sản phẩm</Label>
                                <Input
                                    type="number"
                                    name="price"
                                    value={product.price}
                                    onChange={handleInputChange}
                                    placeholder="Giá sản phẩm"
                                    disabled={isLoading}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="imageUrl">URL ảnh sản phẩm</Label>
                                <Input
                                    type="text"
                                    name="imageUrl"
                                    value={product.imageUrl}
                                    onChange={handleInputChange}
                                    placeholder="URL ảnh sản phẩm"
                                    disabled={isLoading}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="description">Mô tả sản phẩm</Label>
                                <Input
                                    type="textarea"
                                    name="description"
                                    value={product.description}
                                    onChange={handleInputChange}
                                    placeholder="Mô tả sản phẩm"
                                    disabled={isLoading}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="stockQuantity">Số lượng tồn kho</Label>
                                <Input
                                    type="number"
                                    name="stockQuantity"
                                    value={product.stockQuantity}
                                    onChange={handleInputChange}
                                    placeholder="Số lượng tồn kho"
                                    disabled={isLoading}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="categoryId">ID danh mục</Label>
                                <Input
                                    type="number"
                                    name="categoryId"
                                    value={product.categoryId}
                                    onChange={handleInputChange}
                                    placeholder="ID danh mục"
                                    disabled={isLoading}
                                    required
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <h4>Phiên bản và Màu sắc</h4>
                    {product.versions.map((version, versionIndex) => (
                        <Row key={versionIndex} className="mb-3">
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="versionName">Tên phiên bản</Label>
                                    <Input
                                        type="text"
                                        name="versionName"
                                        value={version.versionName}
                                        onChange={(e) => handleInputChange(e, versionIndex)}
                                        placeholder="Tên phiên bản"
                                        disabled={isLoading}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="extraPrice">Giá thêm</Label>
                                    <Input
                                        type="number"
                                        name="extraPrice"
                                        value={version.extraPrice}
                                        onChange={(e) => handleInputChange(e, versionIndex)}
                                        placeholder="Giá thêm"
                                        disabled={isLoading}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                {version.colors.map((color, colorIndex) => (
                                    <Row key={colorIndex} className="align-items-center mb-2">
                                        <Col md={5}>
                                            <FormGroup>
                                                <Label for={`colorName-${versionIndex}-${colorIndex}`}>
                                                    Tên màu
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name={`colorName-${versionIndex}-${colorIndex}`}
                                                    value={color.colorName}
                                                    onChange={(e) => handleInputChange(e, versionIndex, colorIndex)}
                                                    placeholder="Tên màu"
                                                    disabled={isLoading}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={5}>
                                            <FormGroup>
                                                <Label for={`colorCode-${versionIndex}-${colorIndex}`}>
                                                    Mã màu
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name={`colorCode-${versionIndex}-${colorIndex}`}
                                                    value={color.colorCode}
                                                    onChange={(e) => handleInputChange(e, versionIndex, colorIndex)}
                                                    placeholder="Mã màu"
                                                    disabled={isLoading}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                ))}
                            </Col>
                        </Row>
                    ))}

                    <Button 
                        color="primary" 
                        onClick={handleSubmit} 
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang xử lý..." : "Cập nhật sản phẩm"}
                    </Button>
                </Form>
            </div>
        </RequireAuth>
    );
};

export default UpdateProduct;