import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import RequireAuth from '../../components/RequireAuth';

const UpdateCategory = () => {
    const [category, setCategory] = useState({
        name: "",
        description: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy ID từ URL params

    // Tải dữ liệu danh mục khi component mount
    useEffect(() => {
        axios.get(`http://localhost:8080/admin/categories/${id}`, { withCredentials: true })
            .then(response => {
                setCategory(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Lỗi khi tải danh mục:", error);
                alert("Lỗi khi tải danh mục!");
                setIsLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        axios.put(`http://localhost:8080/admin/categories/${id}`, category, { withCredentials: true })
            .then(() => {
                alert("Danh mục đã được cập nhật thành công!");
                navigate("/admin/categories");
            })
            .catch(error => {
                console.error("Lỗi khi cập nhật danh mục:", error);
                alert("Lỗi khi cập nhật danh mục!");
                setIsLoading(false);
            });
    };

    return (
        <RequireAuth roles={["ADMIN", "NHAN_VIEN"]}>
            <div className="container mt-4">
                <h2>Cập nhật Danh Mục</h2>
                {isLoading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="name">Tên danh mục</Label>
                            <Input 
                                type="text" 
                                name="name" 
                                value={category.name} 
                                onChange={handleChange} 
                                required 
                                disabled={isLoading}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Mô tả</Label>
                            <Input 
                                type="textarea" 
                                name="description" 
                                value={category.description} 
                                onChange={handleChange} 
                                required 
                                disabled={isLoading}
                            />
                        </FormGroup>
                        <Button 
                            color="primary" 
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : "Cập nhật danh mục"}
                        </Button>
                    </Form>
                )}
            </div>
        </RequireAuth>
    );
};

export default UpdateCategory;