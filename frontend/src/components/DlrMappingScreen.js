import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select"; // For searchable dropdown
import "../css/DlrMappingScreen.css";


const DlrMappingScreen = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [dlrCodes, setDlrCode] = useState("");
  const [mappings, setMappings] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchVendors();
    fetchMappings();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dlr/vendors");
      setVendors(res.data.map(v => ({ value: v.vendorId, label: v.vendorId })));
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const fetchMappings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dlr/mappings");
      setMappings(res.data); // Set mappings properly
    } catch (error) {
      console.error("Error fetching mappings:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedVendor || !dlrCodes) {
      alert("Please select a vendor and enter a DLR code.");
      return;
    }

    try {
      if (editId) {
        // Update existing mapping
        await axios.put(`http://localhost:5000/api/dlr/mappings/${editId}`, {
          vendorId: selectedVendor.value,
          dlrCodes,
        });
        alert("Mapping updated successfully!");
      } else {
        // Add new mapping
        await axios.post("http://localhost:5000/api/dlr/map", {
          vendorId: selectedVendor.value,
          dlrCodes,
        });
        alert("Mapping added successfully!");
      }

      setDlrCode("");
      setSelectedVendor(null);
      setEditId(null);
      fetchMappings();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to map DLR Code.");
    }
  };

  const handleEdit = (mapping) => {
    setSelectedVendor(vendors.find(v => v.value === mapping.vendorId));
    setDlrCode(mapping.dlrCodes);
    setEditId(mapping._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this mapping?")) {
      try {
        await axios.delete(`http://localhost:5000/api/dlr/mappings/${id}`);
        alert("Mapping deleted successfully!");
        fetchMappings();
      } catch (error) {
        alert("Failed to delete mapping.");
      }
    }
  };

  return (
    <div className="dlr-mapping-container">
  <h2>DLR Code to Vendor Mapping</h2>

  <label>Select Vendor:</label>
  <Select
    className="dlr-select-container"
    options={vendors}
    value={selectedVendor}
    onChange={setSelectedVendor}
    placeholder="Search & select vendor"
  />

  <label>Enter DLR Code:</label>
  <input
    type="text"
    value={dlrCodes}
    onChange={(e) => setDlrCode(e.target.value)}
    placeholder="Enter DLR Code"
    className="dlr-input-field"
  />

  <button onClick={handleSubmit} className="btn btn-primary">
    {editId ? "Update Mapping" : "Map DLR Code"}
  </button>

      <h3>Existing Mappings</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Vendor ID</th>
            <th>DLR Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mappings.map((mapping) => (
            <tr key={mapping._id}>
              <td>{mapping.vendorId}</td>
              <td>{mapping.dlrCodes}</td>
              <td>
                <button onClick={() => handleEdit(mapping)} className="btn btn-warning">Edit</button>
                <button onClick={() => handleDelete(mapping._id)} className="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DlrMappingScreen;
