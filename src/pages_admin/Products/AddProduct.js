import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Row, Col } from "reactstrap";
import RequireAuth from '../../components/RequireAuth';

const AddProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        imageFile: null,
        categoryId: "",
        versions: [
            {
                versionName: "",
                extraPrice: "",
                colors: [{ colorName: "", colorCode: "" }]
            }
        ]
    });

    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8080/admin/categories", { withCredentials: true })
            .then(response => setCategories(response.data))
            .catch(error => console.error("Lỗi khi lấy danh mục:", error));
    }, []);

    const handleChange = (e, versionIndex = null, colorIndex = null) => {
        const { name, value, files } = e.target;
        let updatedProduct = { ...product };

        if (name === "imageFile") {
            updatedProduct.imageFile = files[0];
        } else if (versionIndex === null) {
            updatedProduct[name] = value;
        } else if (colorIndex === null) {
            updatedProduct.versions[versionIndex][name] = value;
        } else {
            updatedProduct.versions[versionIndex].colors[colorIndex][name] = value;
        }
        setProduct(updatedProduct);
    };

    const addVersion = () => {
        setProduct({
            ...product,
            versions: [...product.versions, { versionName: "", extraPrice: "", colors: [{ colorName: "", colorCode: "" }] }]
        });
    };

    const removeVersion = (versionIndex) => {
        if (product.versions.length === 1) {
            alert("Phải có ít nhất một phiên bản!");
            return;
        }
        setProduct({
            ...product,
            versions: product.versions.filter((_, index) => index !== versionIndex)
        });
    };

    const addColor = (versionIndex) => {
        let updatedProduct = { ...product };
        updatedProduct.versions[versionIndex].colors.push({ colorName: "", colorCode: "" });
        setProduct(updatedProduct);
    };

    const removeColor = (versionIndex, colorIndex) => {
        let updatedProduct = { ...product };
        if (updatedProduct.versions[versionIndex].colors.length === 1) {
            alert("Phải có ít nhất một màu!");
            return;
        }
        updatedProduct.versions[versionIndex].colors = updatedProduct.versions[versionIndex].colors.filter(
            (_, index) => index !== colorIndex
        );
        setProduct(updatedProduct);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Step 1: Send product data as JSON
        const productData = {
            name: product.name,
            description: product.description,
            price: product.price,
            stockQuantity: product.stockQuantity,
            categoryId: product.categoryId,
            versions: product.versions
        };

        try {
            const response = await axios.post("http://localhost:8080/admin/products", productData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            const productId = response.data.id; // Giả sử backend trả về ID của sản phẩm

            // Step 2: Upload image file if it exists
            if (product.imageFile) {
                const formData = new FormData();
                formData.append("imageFile", product.imageFile);
                await axios.post(`http://localhost:8080/admin/products/${productId}/upload-image`, formData, {
                    withCredentials: true
                });
            }

            alert("Sản phẩm đã được thêm thành công!");
            navigate("/admin/products");
        } catch (error) {
            console.error("Error adding product:", error.response?.data || error.message);
            alert("Lỗi khi thêm sản phẩm!");
        }
    };

    return (
        <RequireAuth roles={["ADMIN", "NHAN_VIEN"]}>
            <div className="container mt-4">
            <FormGroup>
                        <Label for="name">Tên sản phẩm</Label>
                        <Input 
                            type="text" 
                            name="name" 
                            value={product.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="description">Mô tả</Label>
                        <Input 
                            type="textarea" 
                            name="description" 
                            value={product.description} 
                            onChange={handleChange} 
                            required 
                        />
                    </FormGroup>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="price">Giá</Label>
                                <Input 
                                    type="number" 
                                    name="price" 
                                    value={product.price} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="stockQuantity">Số lượng tồn kho</Label>
                                <Input 
                                    type="number" 
                                    name="stockQuantity" 
                                    value={product.stockQuantity} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="imageFile">Hình ảnh</Label>
                                <Input 
                                    type="file" 
                                    name="imageFile" 
                                    onChange={handleChange} 
                                    // required 
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="categoryId">Danh mục</Label>
                                <Input 
                                    type="select" 
                                    name="categoryId" 
                                    value={product.categoryId} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>

                    

                    {product.versions.map((version, versionIndex) => (
                        <div key={versionIndex}>
                            <h4 style={{ color: '#2E7D32' }}>Phiên bản {versionIndex + 1}</h4>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Tên phiên bản</Label>
                                        <Input 
                                            type="text" 
                                            name="versionName" 
                                            value={version.versionName} 
                                            onChange={(e) => handleChange(e, versionIndex)} 
                                            required 
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Giá thêm</Label>
                                        <Input 
                                            type="number" 
                                            name="extraPrice" 
                                            value={version.extraPrice} 
                                            onChange={(e) => handleChange(e, versionIndex)} 
                                            required 
                                        />
                                    </FormGroup>
                                    <Button 
                                        color="danger" 
                                        onClick={() => removeVersion(versionIndex)}
                                        style={{ marginBottom: '10px' }}
                                    >
                                        Xóa phiên bản
                                    </Button>
                                </Col>
                            </Row>

                            {version.colors.map((color, colorIndex) => (
                                <div key={colorIndex}>
                                    <Row>
                                        <Col md={5}>
                                            <FormGroup>
                                                <Label>Tên màu</Label>
                                                <Input 
                                                    type="text" 
                                                    name="colorName" 
                                                    value={color.colorName} 
                                                    onChange={(e) => handleChange(e, versionIndex, colorIndex)} 
                                                    required 
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={5}>
                                            <FormGroup>
                                                <Label>Mã màu</Label>
                                                <Input 
                                                    type="text" 
                                                    name="colorCode" 
                                                    value={color.colorCode} 
                                                    onChange={(e) => handleChange(e, versionIndex, colorIndex)} 
                                                    required 
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={2}>
                                            <Button 
                                                color="danger" 
                                                onClick={() => removeColor(versionIndex, colorIndex)}
                                                style={{ marginTop: '30px' }}
                                            >
                                                Xóa màu
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            ))}
                            <Button 
                                color="success" 
                                onClick={() => addColor(versionIndex)}
                                style={{ marginBottom: '20px' }}
                            >
                                Thêm màu
                            </Button>
                        </div>
                    ))}

                   
                    <Button 
                        color="success" 
                        onClick={addVersion}
                        style={{ marginRight: '10px', marginBottom: '20px' }}
                    >
                        Thêm phiên bản
                    </Button>
                    <Button 
                        color="primary" 
                        type="submit"
                        style={{ marginBottom: '20px' }}
                    >
                        Thêm sản phẩm
                    </Button>
                </Form>
            </div>
        </RequireAuth>
    );
};

export default AddProduct;