import React, { useState } from 'react';
import axios from 'axios';
import '../css/Vendors.css';

const Vendors = () => {
  const [vendorId, setVendorId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/vendors', { vendorId, password });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response.data.error);
    }
  };

  return (
    <div className="vendor-container">
      <h2>Create Vendor</h2>
      <form onSubmit={handleSubmit} className="vendor-form">
        <div className="form-group">
          <label>Vendor ID:</label>
          <input
            type="text"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Vendor</button>
      </form>
      {message && <p className="vendor-message">{message}</p>}
    </div>
  );
};

export default Vendors;
