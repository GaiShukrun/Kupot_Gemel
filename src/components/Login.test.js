// Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Login from './Login';

// Mock the fetch function
global.fetch = jest.fn();

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  const mockLogin = jest.fn();

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={{ login: mockLogin }}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('allows entering username and password', () => {
    renderLogin();
    const usernameInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(usernameInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('calls login API and handles successful login for regular user', async () => {
    renderLogin();
    const usernameInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'fake-token', user: { role: 'user' } }),
    });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/login', expect.any(Object));
      expect(mockLogin).toHaveBeenCalledWith('user');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('calls login API and handles successful login for admin user', async () => {
    renderLogin();
    const usernameInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'adminpass' } });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'fake-admin-token', user: { role: 'admin' } }),
    });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/login', expect.any(Object));
      expect(mockLogin).toHaveBeenCalledWith('admin');
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  test('handles login failure', async () => {
    renderLogin();
    const usernameInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'invalid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/login', expect.any(Object));
      expect(alertMock).toHaveBeenCalledWith('Error logging in');
    });

    alertMock.mockRestore();
  });
});