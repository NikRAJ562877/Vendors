import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Order.css";

const Orders = () => {
  const [file, setFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editableRows, setEditableRows] = useState({});
  
  // Define fixed headers for the desired fields
  const headers = [
    { key: "dlrCode", label: "DLR CODE" },
    { key: "zone", label: "ZONE" },
    { key: "boDlrNo", label: "BO DLR NO." },
    { key: "partNo", label: "Part No." },
    { key: "orderNo", label: "Order No./New Order No." },
    { key: "po", label: "PO" }
  ];

    // Fetch orders from MongoDB on mount (data persists)
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
  
    useEffect(() => {
      fetchOrders();
    }, []);

  // Handle file selection from the input element
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload the Excel file and extract only the desired fields
  const uploadFile = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:5000/api/orders/upload", formData);
      if (res.data && Array.isArray(res.data.data)) {
        // Map the response to extract only the desired fields (adjust keys as needed)
        const extractedData = res.data.data.map((row) => ({
          dlrCode: row["DLR CODE"] || "",
          zone: row["ZONE"] || "",
          boDlrNo: row["BO DLR NO."] || "",
          partNo: row["Part no."] || "",
          orderNo: row["Order no."] || "",
          po: row["PO"] || ""
        }));
        setOrders(extractedData);
      } else {
        console.error("Invalid API response format", res.data);
      }
    } catch (err) {
      console.error("Error uploading file", err);
    }
  };

  // Toggle edit mode for a specific row
  const toggleEditRow = (index) => {
    setEditableRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Handle change in an input for a given row and field
  const handleInputChange = (index, key, value) => {
    const updatedOrders = [...orders];
    updatedOrders[index][key] = value;
    setOrders(updatedOrders);
  };

  // Delete a row from orders
  const deleteRow = (index) => {
    const updatedOrders = orders.filter((_, i) => i !== index);
    setOrders(updatedOrders);
  };

  // Create a new empty row with only the desired fields
  const createNewRow = () => {
    const newRow = {};
    headers.forEach((header) => {
      newRow[header.key] = "";
    });
    setOrders([...orders, newRow]);
  };

  // Filter orders based on searchTerm across the specified fields
  const filteredOrders = orders.filter((order) =>
    headers.some((header) =>
      order[header.key].toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="orders-container">
      <h2>Order Management</h2>

      {/* Upload and New Row Controls */}
      <div className="upload-section">
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload</button>
        <button onClick={createNewRow}>New Row</button>
      </div>

      {/* Search Filter */}
      {orders.length > 0 && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Search orders..."
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
                <th>Actions</th>
                {headers.map((header) => (
                  <th key={header.key}>{header.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={index}>
                  <td>
                    <button onClick={() => toggleEditRow(index)}>
                      {editableRows[index] ? "Save" : "Edit"}
                    </button>
                    <button onClick={() => deleteRow(index)} className="delete-btn">
                      Delete
                    </button>
                  </td>
                  {headers.map((header) => (
                    <td key={header.key}>
                      {editableRows[index] ? (
                        <input
                          type="text"
                          value={order[header.key]}
                          onChange={(e) =>
                            handleInputChange(index, header.key, e.target.value)
                          }
                        />
                      ) : (
                        order[header.key] || "N/A"
                      )}
                    </td>
                  ))}
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
