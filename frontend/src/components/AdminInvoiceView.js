import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/AdminInvoiceView.css";

const AdminInvoiceView = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [filters, setFilters] = useState({
    month: "",
    date: "",
    vendorId: "",
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get("https://vendors-backend-uspo.onrender.com/api/admin-invoices");
      setInvoices(res.data);
      setFilteredInvoices(res.data); // Initially, show all invoices
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  // ✅ Function to handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Filter invoices based on inputs
  useEffect(() => {
    let filteredData = invoices;

    if (filters.month) {
      filteredData = filteredData.filter((inv) => inv.month === filters.month);
    }

    if (filters.date) {
      filteredData = filteredData.filter((inv) => inv.date === filters.date);
    }

    if (filters.vendorId) {
      filteredData = filteredData.filter((inv) =>
        inv.vendorId.includes(filters.vendorId)
      );
    }

    setFilteredInvoices(filteredData);
  }, [filters, invoices]);

  return (
    <div className="admin-invoice-view">
      <h2>Vendor Invoices</h2>

      {/* 🔹 Filters Section */}
      <div className="invoice-filters">
        <label>
          Month:
          <input
            type="month"
            name="month"
            value={filters.month}
            onChange={handleFilterChange}
          />
        </label>

        <label>
          Date:
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </label>

        <label>
          Vendor ID:
          <input
            type="text"
            name="vendorId"
            placeholder="Enter Vendor ID"
            value={filters.vendorId}
            onChange={handleFilterChange}
          />
        </label>
      </div>

      {/* 🔹 Table to Display Invoices */}
      <table>
        <thead>
          <tr>
            <th>Invoice No.</th>
            <th>Date</th>
            <th>Month</th>
            <th>Amount</th>
            <th>Vendor ID</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => (
              <tr key={invoice._id}>
                <td>{invoice.invoiceNo}</td>
                <td>{invoice.date}</td>
                <td>{invoice.month}</td>
                <td>{invoice.amount}</td>
                <td>{invoice.vendorId}</td>
                <td>
                  {Array.isArray(invoice.fileName) ? (
                    invoice.fileName.map((file, index) => (
                      <div key={index}>
                        <a href={`https://vendors-backend-uspo.onrender.com/uploads/${file}`} download>
                          📄 {file}
                        </a>
                      </div>
                    ))
                  ) : (
                    <a href={`https://vendors-backend-uspo.onrender.com/uploads/${invoice.fileName}`} download>
                      📄 {invoice.fileName}
                    </a>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>No invoices found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminInvoiceView;
