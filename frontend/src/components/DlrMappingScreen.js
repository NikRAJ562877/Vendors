import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";  // For multi-selection dropdown
import "../css/DlrMappingScreen.css";

const DlrMappingScreen = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [dlrCodeOptions, setDlrCodeOptions] = useState([]);
  const [selectedDlrCodes, setSelectedDlrCodes] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [editId, setEditId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchVendors();
    fetchDlrCodes();
    fetchMappings();
  }, []);

  // Fetch vendors
  const fetchVendors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dlr/vendors");
      setVendors(res.data.map(v => ({ value: v.vendorId, label: v.vendorId })));
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  // Fetch unique DLR Codes
  const fetchDlrCodes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dlr/unmapped-dlr-codes");
      setDlrCodeOptions(res.data.map(code => ({ value: code, label: code })));
    } catch (error) {
      console.error("Error fetching unmapped DLR codes:", error);
    }
  };

  // Fetch existing mappings
  const fetchMappings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dlr/mapping");
      console.log("Mappings Data:", res.data);
      setMappings(res.data);
    } catch (error) {
      console.error("Error fetching unmapped DLR codes:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedVendor || selectedDlrCodes.length === 0) {
      alert("Please select a vendor and at least one DLR code.");
      return;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/dlr/mappings/${editId}`, {
          vendorId: selectedVendor.value,
          dlrCodes: selectedDlrCodes.map(d => d.value),
          date: selectedDate,
        });
        alert("Mapping updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/dlr/map", {
          vendorId: selectedVendor.value,
          dlrCodes: selectedDlrCodes.map(d => d.value),
          date: selectedDate,
        });
        alert("Mapping added successfully!");
      }

      setSelectedDlrCodes([]);
      setSelectedVendor(null);
      setEditId(null);
      fetchMappings();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to map DLR Code.");
    }
  };

  const handleEdit = (mapping) => {
    setSelectedVendor(vendors.find(v => v.value === mapping.vendorId));
    setSelectedDlrCodes(mapping.dlrCodes.map(code => ({ value: code, label: code })));
    setEditId(mapping._id);
  };

  return (
    <div className="dlr-mapping-container">
      <h2>DLR Code to Vendor Mapping</h2>
  
      <div className="dlr-form-row">
        <div className="dlr-form-group">
          <label>Select Vendor:</label>
          <Select
            className="dlr-select-container"
            options={vendors}
            value={selectedVendor}
            onChange={setSelectedVendor}
            placeholder="Search & select vendor"
            menuPlacement="auto"
            menuPosition="fixed"
          />
        </div>
  
        <div className="dlr-form-group">
          <label>Select DLR Codes:</label>
          <Select
            className="dlr-input-field"
            options={dlrCodeOptions}
            value={selectedDlrCodes}
            onChange={setSelectedDlrCodes}
            placeholder="Select DLR Codes"
            isMulti
            menuPlacement="auto"
            menuPosition="fixed"
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 1000 }) }}
          />
        </div>
  
        <div className="dlr-form-group">
          <label>Select Date:</label>
          <input
            type="date"
            className="dlr-date-picker"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>
  
      <button onClick={handleSubmit} className="btn btn-primary">
        {editId ? "Update Mapping" : "Map DLR Code"}
      </button>
  
      <h3>Existing Mappings</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Vendor ID</th>
            <th>DLR Codes</th>
            <th>Mapped Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mappings.map((mapping) => (
            <tr key={mapping._id}>
              <td>{mapping.vendorId}</td>
              <td>{mapping.dlrCodes.join(", ")}</td>
              <td>{mapping.date || "Not Set"}</td>
              <td>
                <button onClick={() => handleEdit(mapping)} className="btn btn-warning">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DlrMappingScreen;
