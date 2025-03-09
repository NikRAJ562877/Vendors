import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VendorDashboard = () => {
  const [vendorOrders, setVendorOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve vendor info from sessionStorage (set during login)
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.role === "vendor") {
      const fetchVendorOrders = async () => {
        try {
          console.log("Vendor ID from session:", user.vendorId);

          const res = await axios.get(`http://localhost:5000/api/vendorOrders/${user.vendorId}/getOrderDtls`);
          
          setVendorOrders(res.data);
        } catch (err) {
          console.error("Error fetching vendor orders:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchVendorOrders();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading vendor orders...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Vendor Orders</h2>
      {vendorOrders ? (
        vendorOrders.orders && vendorOrders.orders.length > 0 ? (
          <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>DLR CODE</th>
                <th>DLRNAME</th>
                <th>Part no.</th>
                <th>QTY</th>
                <th>Order no.</th>
                <th>PO</th>
              </tr>
            </thead>
            <tbody>
  {vendorOrders.orders.map((order, index) => (
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
          <p>No orders received yet.</p>
        )
      ) : (
        <p>No orders found for your vendor ID.</p>
      )}
    </div>
  );
};

export default VendorDashboard;
