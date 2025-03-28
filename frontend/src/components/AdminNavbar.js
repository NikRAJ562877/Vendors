import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/AdminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-navbar-brand">
          <Link to="/admin-dashboard">Admin Dashboard</Link>
        </div>
        <ul className="admin-navbar-links">
        <li className="dropdown">
  <span className="dropdown-toggle">Orders</span>
  <ul className="dropdown-menu">
    <li><Link to="/orders">Manage Orders</Link></li>
    <li><Link to="/order-history">Order History</Link></li>
  </ul>
</li>
          <li><Link to="/vendors">Vendor Management</Link></li>
          <li><Link to="/admin-invoices">View Invoices</Link></li>
          <li><Link to="/dlr-mapping">DLR Mapping</Link></li>
          <li><Link to="/product-master">Product Master</Link></li> 
          <li className="dropdown">
            <span className="dropdown-toggle">Report</span>
            <ul className="dropdown-menu"> 
          <li><Link to="/reports">Reports</Link></li>
          <li><Link to="/report-history">Report History</Link></li>
          </ul>
          </li>  
          <li>
            <button onClick={handleLogout} className="admin-logout-button">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
