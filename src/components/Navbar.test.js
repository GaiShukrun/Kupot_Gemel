import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import { act } from 'react';
import Swal from 'sweetalert2';


jest.mock('sweetalert2');

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock alert
global.alert = jest.fn();

const renderNavbar = (authContextValue) => {
  return render(
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <Navbar />
      </Router>
    </AuthContext.Provider>
  );
};

describe('Navbar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    global.alert.mockClear();
  });

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

  it('calls logout function when Logout button is clicked', async () => {
    const logoutMock = jest.fn().mockResolvedValue();
    const mockNavigate = jest.fn();
  
    renderNavbar({ isAuthenticated: true, logout: logoutMock, navigate: mockNavigate });
  
    // Mock the Swal.fire response
    Swal.fire.mockResolvedValue({
      isConfirmed: true,
    });
  
    await act(async () => {
      fireEvent.click(screen.getByText('Logout'));
    });
  
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
  
      expect(logoutMock).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalled();
    });
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