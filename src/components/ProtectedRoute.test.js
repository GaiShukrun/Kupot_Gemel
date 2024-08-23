import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';

describe('ProtectedRoute', () => {
  test('renders the children when user is authenticated and has the required role', () => {
    const AuthProvider = ({ children }) => (
      <AuthContext.Provider value={{ isAuthenticated: true, user: { role: 'admin' } }}>
        {children}
      </AuthContext.Provider>
    );

    render(
      <AuthProvider>
        <Router>
          <ProtectedRoute requiredRole="admin">
            <div>Protected Content</div>
          </ProtectedRoute>
        </Router>
      </AuthProvider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to login page when user is not authenticated', () => {
    const AuthProvider = ({ children }) => (
      <AuthContext.Provider value={{ isAuthenticated: false, user: { role: 'admin' } }}>
        {children}
      </AuthContext.Provider>
    );

    render(
      <AuthProvider>
        <Router>
          <ProtectedRoute requiredRole="admin">
            <div>Protected Content</div>
          </ProtectedRoute>
        </Router>
      </AuthProvider>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('redirects to login page when user does not have the required role', () => {
    const AuthProvider = ({ children }) => (
      <AuthContext.Provider value={{ isAuthenticated: true, user: { role: 'user' } }}>
        {children}
      </AuthContext.Provider>
    );

    render(
      <AuthProvider>
        <Router>
          <ProtectedRoute requiredRole="admin">
            <div>Protected Content</div>
          </ProtectedRoute>
        </Router>
      </AuthProvider>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});