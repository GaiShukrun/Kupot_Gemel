import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      alert('Logout successful');
      navigate('/');
      navigate(0); // refresh
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/" className={isActive('/') ? 'navbar-link navbar-link-active' : 'navbar-link'}>
            Home
          </Link>
        </li>
        {!isAuthenticated ? (
          <>
            <li className="navbar-item">
              <Link to="/login" className={isActive('/login') ? 'navbar-link navbar-link-active' : 'navbar-link'}>
                Login
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/register" className={isActive('/register') ? 'navbar-link navbar-link-active' : 'navbar-link'}>
                Register
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="navbar-item">
              <Link to="/favorite-funds" className={isActive('/favorite-funds') ? 'navbar-link navbar-link-active' : 'navbar-link'}>
                Favorite Funds
              </Link>
            </li>
            {userRole === 'admin' && (
              <li className="navbar-item">
                <Link to="/admin" className={isActive('/admin') ? 'navbar-link navbar-link-active' : 'navbar-link'}>
                  User Management
                </Link>
              </li>
            )}
            {userRole === 'tech' && (
              <li className="navbar-item">
                <Link to="/support-dashboard" className={isActive('/support-dashboard') ? 'navbar-link navbar-link-active' : 'navbar-link'}>
                  Support Dashboard
                </Link>
              </li>
            )}
            <li className="navbar-item">
              <Link to="/questions-form" className={isActive('/questions-form') ? 'navbar-link navbar-link-active' : 'navbar-link'}>
                Personal Questions
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/recommended-funds" className={isActive('/recommended-funds') ? 'navbar-link navbar-link-active' : 'navbar-link'}>
                Recommended Funds
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/about-us" className={isActive('/about-us') ? 'navbar-link navbar-link-active' : 'navbar-link'}>
                About Us
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/my-account" className={isActive('/my-account') ? 'navbar-link navbar-link-active' : 'navbar-link'}>
                My Account
              </Link>
            </li>
            <li className="navbar-item">
              <button className="navbar-button" onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
