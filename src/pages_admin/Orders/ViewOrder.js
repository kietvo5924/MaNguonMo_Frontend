import React, { useState, useEffect } from "react";
import { Button, Table } from "reactstrap";
import axios from "axios";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/orders")
      .then(response => setOrders(response.data))
      .catch(error => console.error("Lỗi tải dữ liệu:", error));
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Quản lý Đơn hàng</h2>
      </div>
      <Table bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Mã đơn hàng</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.id}>
              <td>{index + 1}</td>
              <td>{order.orderCode}</td>
              <td>{order.customerName}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>{order.status}</td>
              <td>
                <Button color="info" size="sm" className="me-2">Chi tiết</Button>
                <Button color="warning" size="sm" className="me-2">Sửa</Button>
                <Button color="danger" size="sm">Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderManagement;
