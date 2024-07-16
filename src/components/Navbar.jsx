// Navbar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout(); // Calls the logout function from AuthContext
      alert('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed');
    }
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">Home</Link>
        </li>
        {!isAuthenticated ? (
          <>
            <li className="navbar-item">
              <Link to="/login" className="navbar-link">Login</Link>
            </li>
            <li className="navbar-item">
              <Link to="/register" className="navbar-link">Register</Link>
            </li>
          </>
        ) : (
          <>
            {userRole === 'admin' && (
              <li className="navbar-item">
                <Link to="/admin" className="navbar-link">User Management</Link>
              </li>
            )}
            <li className="navbar-item">
              <button className="navbar-link" onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;