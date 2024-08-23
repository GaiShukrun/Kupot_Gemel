import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import PrivateRoute from './PrivateRoute';

describe('PrivateRoute', () => {
  test('renders the component when user is authenticated and has admin role', () => {
    const AuthProvider = ({ children }) => (
      <AuthContext.Provider value={{ isAuthenticated: true, userRole: 'admin' }}>
        {children}
      </AuthContext.Provider>
    );

    const TestComponent = () => <div>Protected Content</div>;

    render(
      <AuthProvider>
        <Router>
          <PrivateRoute element={TestComponent} />
        </Router>
      </AuthProvider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to home page when user is not authenticated or does not have admin role', () => {
    const AuthProvider = ({ children }) => (
      <AuthContext.Provider value={{ isAuthenticated: false, userRole: 'user' }}>
        {children}
      </AuthContext.Provider>
    );

    const TestComponent = () => <div>Protected Content</div>;

    render(
      <AuthProvider>
        <Router>
          <PrivateRoute element={TestComponent} />
        </Router>
      </AuthProvider>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});