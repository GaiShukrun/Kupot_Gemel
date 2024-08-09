import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

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

  const navbarStyles = {
    backgroundColor: '#007BFF',
    padding: '10px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  };

  const listStyles = {
    listStyle: 'none',
    display: 'flex',
    margin: 0,
    padding: 0,
  };

  const itemStyles = {
    margin: '0 15px',
  };

  const linkStyles = (active) => ({
    color: active ? '#b1cdcd' : 'white',
    textDecoration: 'none',
    fontSize: '18px',
  });

  const buttonStyles = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'white',
    fontSize: '18px',
    padding: 0,
    textDecoration: 'none',
  };

  return (
    <nav style={navbarStyles}>
      <ul style={listStyles}>
        <li style={itemStyles}>
          <Link to="/" style={linkStyles(isActive('/'))}>Home</Link>
        </li>
        {!isAuthenticated ? (
          <>
            <li style={itemStyles}>
              <Link to="/login" style={linkStyles(isActive('/login'))}>Login</Link>
            </li>
            <li style={itemStyles}>
              <Link to="/register" style={linkStyles(isActive('/register'))}>Register</Link>
            </li>
          </>
        ) : (
          <>
            <li style={itemStyles}>
              <Link to="/favorite-funds" style={linkStyles(isActive('/favorite-funds'))}>My Favorite Funds</Link>
            </li>
            {userRole === 'admin' && (
              <li style={itemStyles}>
                <Link to="/admin" style={linkStyles(isActive('/admin'))}>User Management</Link>
              </li>
            )}
            <li style={itemStyles}>
              <Link to="/questions-form" style={linkStyles(isActive('/questions-form'))}>Personal Questions</Link>
            </li>
            <li style={itemStyles}>
              <Link to="/recommended-funds" style={linkStyles(isActive('/recommended-funds'))}>My Recommended Funds</Link>
            </li>
            <li style={itemStyles}>
              <button style={buttonStyles} onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
