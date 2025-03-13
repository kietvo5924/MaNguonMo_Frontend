import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages_admin/AdminPage";
import Navbar from "./components/Navbar";
import './App.css';
import CategoryManagement from "./pages_admin/CategoryManagement";
import AddProduct from "./pages_admin/Products/AddProduct";
import UpdateProduct from "./pages_admin/Products/UpdateProduct";
import ViewProduct from "./pages_admin/Products/ViewProduct";

function App() {
  return (
    <Router>
      < Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/categories" element={<CategoryManagement />} /> {/* Thêm route cho danh mục */}

        {/* Add the routes for products */}
        <Route path="/admin/products/add" element={<AddProduct />} /> {/* Add product */}
        <Route path="/admin/products/update/:id" element={<UpdateProduct />} /> {/* Update product */}
        <Route path="/admin/products/view" element={<ViewProduct />} /> {/* View products */}
      </Routes>
    </Router>
  );
}

export default App;
