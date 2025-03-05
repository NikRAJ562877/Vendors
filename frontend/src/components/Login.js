import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Login.css';

const Login = ({ setUser }) => {
  const [vendorId, setVendorId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Clear any stale user info on mount
  useEffect(() => {
    sessionStorage.removeItem('user');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting login:", { vendorId, password });

    try {
      // The backend decides if it's an admin or vendor
      const res = await axios.post('http://localhost:5000/api/auth/login', { vendorId, password });
      console.log("Login response:", res.data);

      if (res.data.message === 'Login successful') {
        // Save user info in sessionStorage
        sessionStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);

        // Redirect based on user role
        if (res.data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/vendor-dashboard');
        }
      }
    } catch (err) {
      console.error("Login error:", err.response?.data);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="vendorId" className="form-label">User ID</label>
          <input
            id="vendorId"
            type="text"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <button type="submit" className="login-button">Sign In</button>

        {/* Optional: Link to admin signup if needed */}
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Need an admin account? <Link to="/admin-signup">Create one here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
