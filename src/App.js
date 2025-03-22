import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages_admin/AdminPage";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import RequireAuth from "./components/RequireAuth";
import "./App.css";
import ViewCategory from "./pages_admin/Categorys/ViewCategory";
import AddProduct from "./pages_admin/Products/AddProduct";
import UpdateProduct from "./pages_admin/Products/UpdateProduct";
import ViewProduct from "./pages_admin/Products/ViewProduct";
import ViewUser from "./pages_admin/Users/ViewUser";
import ViewOrder from "./pages_admin/Orders/ViewOrder";
import AddCategory from "./pages_admin/Categorys/AddCategory";
import UpdateCategory from "./pages_admin/Categorys/UpdateCategory";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />

        {/* Bọc các route admin với RequireAuth */}
        <Route
          path="/admin/*"
          element={
            <RequireAuth roles={["ADMIN", "NHAN_VIEN"]}>
              <AdminNavbar />
              <Routes>
                <Route path="/" element={<AdminPage />} />
                <Route path="categories" element={<ViewCategory />} />
                <Route path="categories/add" element={<AddCategory />} />
                <Route path="categories/update/:id" element={<UpdateCategory />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/update/:id" element={<UpdateProduct />} />
                <Route path="products" element={<ViewProduct />} />
                <Route path="users" element={<ViewUser />} />
                <Route path="orders" element={<ViewOrder />} />
              </Routes>
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
