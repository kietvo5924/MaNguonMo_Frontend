import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import RequireAuth from '../../components/RequireAuth';

const AddCategory = () => {
    const [category, setCategory] = useState({
        name: "",
        description: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8080/admin/categories", category, { withCredentials: true })
            .then(() => {
                alert("Danh mục đã được thêm thành công!");
                navigate("/admin/categories");
            })
            .catch(() => {
                alert("Lỗi khi thêm danh mục!");
            });
    };

    return (
        <RequireAuth roles={["ADMIN", "NHAN_VIEN"]}>
            <div className="container mt-4">
                <h2>Thêm Danh Mục</h2>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="name">Tên danh mục</Label>
                        <Input type="text" name="name" value={category.name} onChange={handleChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Mô tả</Label>
                        <Input type="textarea" name="description" value={category.description} onChange={handleChange} required />
                    </FormGroup>
                    <Button color="primary" type="submit">Thêm danh mục</Button>
                </Form>
            </div>
        </RequireAuth>
    );
};

export default AddCategory;
