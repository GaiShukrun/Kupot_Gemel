// navbar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';

const renderNavbar = (authContextValue) => {
  render(
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <Navbar />
      </Router>
    </AuthContext.Provider>
  );
};

describe('Navbar', () => {
  it('renders Home link', () => {
    renderNavbar({ isAuthenticated: false });

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders Login and Register links when not authenticated', () => {
    renderNavbar({ isAuthenticated: false });

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('does not render Login and Register links when authenticated', () => {
    renderNavbar({ isAuthenticated: true });

    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  it('renders Logout button when authenticated', () => {
    renderNavbar({ isAuthenticated: true });

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls logout function when Logout button is clicked', () => {
    const logoutMock = jest.fn();
    renderNavbar({ isAuthenticated: true, logout: logoutMock });

    fireEvent.click(screen.getByText('Logout'));

    expect(logoutMock).toHaveBeenCalled();
  });

  it('renders User Management link for admin users', () => {
    renderNavbar({ isAuthenticated: true, userRole: 'admin' });

    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  it('does not render User Management link for non-admin users', () => {
    renderNavbar({ isAuthenticated: true, userRole: 'user' });

    expect(screen.queryByText('User Management')).not.toBeInTheDocument();
  });
});
