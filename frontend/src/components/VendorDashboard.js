import React, { useEffect, useState } from "react";
import axios from "axios";

const VendorDashboard = () => {
  const [vendorOrders, setVendorOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Get vendor details from session
  const user = JSON.parse(sessionStorage.getItem("user"));
  const vendorId = user?.vendorId;

  // Fetch vendor orders based on date range
  const fetchVendorOrders = async () => {
    if (!vendorId) return;
    
    try {
      setLoading(true);
      
      const res = await axios.get(`http://localhost:5000/api/vendorOrders/orders/${vendorId}`, {
        params: { from_date: fromDate, to_date: toDate }
      });

      setVendorOrders(res.data);
    } catch (err) {
      console.error("Error fetching vendor orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch orders when date range changes
  useEffect(() => {
    if (fromDate && toDate) {
      fetchVendorOrders();
    }
  }, [fromDate, toDate]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Vendor Orders</h2>

      {/* Date Range Filters */}
      <div style={{ marginBottom: "1rem" }}>
        <label>From Date: </label>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        
        <label style={{ marginLeft: "1rem" }}>To Date: </label>
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
      </div>

      {loading ? (
        <p>Loading vendor orders...</p>
      ) : vendorOrders.length > 0 ? (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>DLR CODE</th>
              <th>DLR NAME</th>
              <th>Part No.</th>
              <th>QTY</th>
              <th>Order No.</th>
              <th>PO</th>
            </tr>
          </thead>
          <tbody>
            {vendorOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.dlrCode || "N/A"}</td>
                <td>{order.dlrName || "N/A"}</td>
                <td>{order.partNo || "N/A"}</td>
                <td>{order.qty || "N/A"}</td>
                <td>{order.orderNo || "N/A"}</td>
                <td>{order.po || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found for the selected date range.</p>
      )}
    </div>
  );
};

export default VendorDashboard;
