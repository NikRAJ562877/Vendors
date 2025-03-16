import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AdminInvoiceView.css';

const AdminInvoiceView = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin-invoices');
      setInvoices(res.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  return (
    <div className="admin-invoice-view">
      <h2>Vendor Invoices</h2>
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
          {invoices.map((invoice) => (
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
        <a href={`http://localhost:5000/uploads/${file}`} download>
          📄 {file}
        </a>
      </div>
    ))
  ) : (
    <a href={`http://localhost:5000/uploads/${invoice.fileName}`} download>
      📄 {invoice.fileName}
    </a>
  )}
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminInvoiceView;
