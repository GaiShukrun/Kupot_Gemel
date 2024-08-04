import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
function Navbar() {
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      alert('Logout successful');
      navigate('/');


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
           <li className="navbar-item">
              <Link to="/favorite-funds" className="navbar-link">My Favorite Funds</Link>
            </li>
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