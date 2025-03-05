import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Order.css";
const Orders = () => {
  const [file, setFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [editableRows, setEditableRows] = useState({});
  const [selectedRows, setSelectedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Handle File Selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload File & Fetch Data
  const uploadFile = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:5000/api/orders/upload", formData);
      if (res.data && Array.isArray(res.data.data)) {
        setOrders(res.data.data);
        setFilteredOrders(res.data.data); 
      } else {
        console.error("Invalid API response format", res.data);
      }
    } catch (err) {
      console.error("Error uploading file", err);
    }
  };

  // Handle Checkbox Selection
  const handleCheckboxChange = (index) => {
    setEditableRows((prev) => ({ ...prev, [index]: !prev[index] }));
    setSelectedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Handle Input Change
  const handleInputChange = (index, field, value) => {
    const updatedOrders = [...filteredOrders];
    updatedOrders[index][field] = value;
    setFilteredOrders(updatedOrders);
  };

  // Handle Search Filtering
  useEffect(() => {
    if (!searchTerm) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) =>
        Object.values(order)
          .filter((val) => typeof val === "string" || typeof val === "number")
          .some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

  // Handle "Send to Vendor" Action
  const sendToVendor = () => {
    const selectedOrders = filteredOrders.filter((_, index) => selectedRows[index]);
    console.log("Orders sent to vendor:", selectedOrders);
    alert(`Sent ${selectedOrders.length} orders to vendor!`);
  };

  return (
    <div className="orders-container">
      <h2>Order Management</h2>

      {/* Upload & Send Section */}
      <div className="upload-section">
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload</button>
        {Object.values(selectedRows).some((isSelected) => isSelected) && (
          <button className="send-btn" onClick={sendToVendor}>Send to Vendor</button>
        )}
      </div>

      {/* Search Filter */}
      {orders.length > 0 && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Order ID, Product Name, or Vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Orders Table */}
      <div className="table-container">
        {filteredOrders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Select</th>
                {Object.keys(filteredOrders[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows[index] || false}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                  {Object.entries(order).map(([key, val]) => (
                    <td key={key}>
                      {editableRows[index] ? (
                        <input
                          type="text"
                          value={val || ""}
                          onChange={(e) =>
                            handleInputChange(index, key, e.target.value)
                          }
                        />
                      ) : (
                        val || "N/A"
                      )}
                    </td>
                  ))}
                  <td>
                    <button onClick={() => handleCheckboxChange(index)}>
                      {editableRows[index] ? "Save" : "Edit"}
                    </button>
                    <button className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          orders.length > 0 && <p>No matching results found.</p>
        )}
      </div>
    </div>
  );
}; 

export default Orders; 