import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orderhistory");  // ✅ Ensure correct URL
        setOrders(response.data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading order history...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="order-history-container">
      <h2>Order History</h2>
      <table className="order-history-table">
        <thead>
          <tr>
            <th>Order No.</th>
            <th>Dealer Code</th>
            <th>Dealer Name</th>
            <th>Part No.</th>
            <th>Quantity</th>
            <th>PO</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderNo}</td>
                <td>{order.dlrCode}</td>
                <td>{order.dlrName}</td>
                <td>{order.partNo}</td>
                <td>{order.qty}</td>
                <td>{order.po}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;
