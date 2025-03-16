import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
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
    const navigate = useNavigate();

    const handleChange = (e, versionIndex = null, colorIndex = null) => {
        const { name, value } = e.target;
        let updatedProduct = { ...product };

        if (name === "imageFile") {
            updatedProduct.imageFile = e.target.files[0];
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

    const addColor = (versionIndex) => {
        let updatedProduct = { ...product };
        updatedProduct.versions[versionIndex].colors.push({ colorName: "", colorCode: "" });
        setProduct(updatedProduct);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(product).forEach(key => {
            if (key !== "versions" && key !== "imageFile") {
                formData.append(key, product[key]);
            }
        });
        if (product.imageFile) {
            formData.append("imageFile", product.imageFile);
        }
        axios.post("http://localhost:8080/admin/products", formData, { withCredentials: true })
            .then(() => {
                alert("Sản phẩm đã được thêm thành công!");
                navigate("/admin/products");
            })
            .catch(() => {
                alert("Lỗi khi thêm sản phẩm!");
            });
    };

    return (
        <RequireAuth roles={["ADMIN", "NHAN_VIEN"]}>
            <div className="container mt-4">
                <h2>Thêm Sản phẩm</h2>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <FormGroup>
                        <Label for="name">Tên sản phẩm</Label>
                        <Input type="text" name="name" value={product.name} onChange={handleChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Mô tả</Label>
                        <Input type="textarea" name="description" value={product.description} onChange={handleChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="price">Giá</Label>
                        <Input type="number" name="price" value={product.price} onChange={handleChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="stockQuantity">Số lượng tồn kho</Label>
                        <Input type="number" name="stockQuantity" value={product.stockQuantity} onChange={handleChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="imageFile">Hình ảnh</Label>
                        <Input type="file" name="imageFile" onChange={handleChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="categoryId">ID Danh mục</Label>
                        <Input type="number" name="categoryId" value={product.categoryId} onChange={handleChange} required />
                    </FormGroup>

                    {product.versions.map((version, versionIndex) => (
                        <div key={versionIndex}>
                            <h4>Phiên bản {versionIndex + 1}</h4>
                            <FormGroup>
                                <Label>Tên phiên bản</Label>
                                <Input type="text" name="versionName" value={version.versionName} onChange={(e) => handleChange(e, versionIndex)} required />
                            </FormGroup>
                            <FormGroup>
                                <Label>Giá thêm</Label>
                                <Input type="number" name="extraPrice" value={version.extraPrice} onChange={(e) => handleChange(e, versionIndex)} required />
                            </FormGroup>

                            {version.colors.map((color, colorIndex) => (
                                <div key={colorIndex}>
                                    <FormGroup>
                                        <Label>Tên màu</Label>
                                        <Input type="text" name="colorName" value={color.colorName} onChange={(e) => handleChange(e, versionIndex, colorIndex)} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Mã màu</Label>
                                        <Input type="text" name="colorCode" value={color.colorCode} onChange={(e) => handleChange(e, versionIndex, colorIndex)} required />
                                    </FormGroup>
                                </div>
                            ))}
                            <Button color="secondary" onClick={() => addColor(versionIndex)}>Thêm màu</Button>
                        </div>
                    ))}
                    <Button color="secondary" onClick={addVersion}>Thêm phiên bản</Button>
                    <Button color="primary" type="submit">Thêm sản phẩm</Button>
                </Form>
            </div>
        </RequireAuth>
    );
};

export default AddProduct;