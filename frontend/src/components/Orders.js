import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "../css/Order.css";
import axios from 'axios';
const Orders = () => {
  // Local state
  const [file, setFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editableRows, setEditableRows] = useState({});
  const [selectedRows, setSelectedRows] = useState({});
  const [vendorId, setVendorId] = useState("");

  // Fixed headers (keys exactly as used in your Excel file and display labels)
  const headers = [
    { key: "DLRCODE", label: "DLR CODE" },
    { key: "DLRNAME", label: "DLRNAME" },
    { key: "Part no.", label: "Part No." },
    { key: "Qty", label: "QTY" },
    { key: "Order no.", label: "Order No./New Order No." },
    { key: "PO", label: "PO" },
    {key:"VendorsId",label:"VendorsId"}
  ];

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Update localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // Handle file selection from input
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("Selected file:", selectedFile);
    setFile(selectedFile);
  };

  // Upload file: parse Excel on client-side and update orders state
  const uploadFile = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      // Map to extract only the desired fields (keys must match exactly)
      const extractedData = jsonData.map((row) => ({
        "DLRCODE": row["DLRCODE"] || "",
        "DLRNAME": row["DLRNAME"] || "",
        "Part no.": row["Part no."] || "",
        "Qty": row["Qty"] || "",
        "Order no.": row["Order no."] || "",
        "PO": row["PO"] || "",
        "VendorsId":row["VendorsId"]||""
      }));
      setOrders(extractedData);
    };
    reader.readAsArrayBuffer(file);
  };

  // Toggle edit mode for a row
  const toggleEditRow = (index) => {
    setEditableRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Handle input change for a row and field
  const handleInputChange = (index, key, value) => {
    const updatedOrders = [...orders];
    updatedOrders[index][key] = value;
    setOrders(updatedOrders);
  };

  // Delete a row (update local state)
  const deleteRow = (index) => {
    setOrders((prev) => prev.filter((_, i) => i !== index));
  };

  // Create a new row (set default values; note "DLR CODE" is required so provide a default)
  const createNewRow = () => {
    const newRow = {};
    headers.forEach((header) => {
      // For required field "DLR CODE", we provide a temporary value if empty.
      newRow[header.key] = header.key === "DLR CODE" ? "TEMP" : "";
    });
    setOrders((prev) => [...prev, newRow]);
    setEditableRows((prev) => ({ ...prev, [orders.length]: true }));
  };

  // Handle checkbox selection for each row
  const handleCheckboxChange = (index) => {
    setSelectedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Send selected orders to a specific vendor (simulate sending)
  const sendToVendor = async () => {
    if (orders.length === 0) {
      alert("No orders to upload.");
      return;
    }
  
    const formattedOrders = orders.map(order => ({
      dlrCode: order["DLRCODE"],
      dlrName: order["DLRNAME"],
      partNo: order["Part no."],
      qty: order["Qty"],
      orderNo: order["Order no."],
      po: order["PO"],
      VendorsId: order["VendorsId"]
    }));
  
    try {
      const res = await axios.post(
        "http://localhost:5000/api/order/upload",
        { orders: formattedOrders }, // Wrap orders inside an object
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      console.log("Response from API:", res.data);
      alert(`Successfully uploaded ${orders.length} orders to the backend.`);
    } catch (error) {
      console.error("Upload failed:", error.response ? error.response.data : error);
      alert("Failed to upload orders. Please check the server logs and try again.");
    }
  };
  

  // Filter orders based on search term across fixed fields
  const filteredOrders = orders.filter((order) =>
    headers.some((header) =>
      order[header.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Vendor ID Input and Send Button */}
      <div style={{ margin: "1rem 0" }}>
        <button onClick={sendToVendor} style={{ marginLeft: "0.5rem" }}>
          Send to Vendor
        </button>
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
                        order[header.key] ? order[header.key] : ""
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
