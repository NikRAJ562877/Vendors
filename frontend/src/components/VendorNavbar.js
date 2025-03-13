import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/VendorNavbar.css';

const VendorNavbar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="vendor-navbar">
      <div className="vendor-navbar-container">
        <div className="vendor-navbar-brand">
          <Link to="/vendor-dashboard">Vendor Portal</Link>
        </div>
        <ul className="vendor-navbar-links">
          <li><Link to="/vendor-dashboard">Home</Link></li>
          <li><Link to="/vendor-invoices">Upload Invoice</Link></li>
          <li>
            <button onClick={handleLogout} className="vendor-logout-button">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default VendorNavbar;
