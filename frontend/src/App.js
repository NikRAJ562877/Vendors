import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminSignup from './components/AdminSignup'; // New admin signup component
import AdminDashboard from './components/AdminDashboard';
import Orders from './components/Orders';
import Report from './components/Report';
import Vendors from './components/Vendors';
import VendorDashboard from './components/VendorDashboard';
import AdminNavbar from './components/AdminNavbar';
import VendorNavbar from './components/VendorNavbar';

// Admin layout: uses AdminNavbar and routes to admin pages
const AdminLayout = () => (
  <>
    <AdminNavbar />
    <div className="container">
      <Routes>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/report" element={<Report />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="*" element={<Navigate to="/admin-dashboard" />} />
      </Routes>
    </div>
  </>
);

// Vendor layout: uses VendorNavbar and routes to vendor pages
const VendorLayout = () => (
  <>
    <VendorNavbar />
    <div className="container">
      <Routes>
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/report" element={<Report />} />
        <Route path="*" element={<Navigate to="/vendor-dashboard" />} />
      </Routes>
    </div>
  </>
);
const App = () => {
  // State for authenticated user and loading flag
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, load any stored user (if exists)
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Optionally show a loading spinner
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        {user ? (
          user.role === 'admin'? (
            <Route path="/*" element={<AdminLayout />} />
          ) : (
            <Route path="/*" element={<VendorLayout />} />
          )
        ) : (
          <Route path="/*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
