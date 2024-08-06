import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Login from './Login';
import { act } from 'react-dom/test-utils';

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.alert
global.alert = jest.fn();

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockLogin = jest.fn();

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ login: mockLogin }}>
        {ui}
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockLogin.mockClear();
    mockNavigate.mockClear();
    global.alert.mockClear();
  });

  test('renders login form', () => {
    renderWithRouter(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('allows user to enter credentials', () => {
    renderWithRouter(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('submits the form and logs in successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'fake-token', user: { role: 'user', firstname: 'John', lastname: 'Doe', userId: 'fake123456' } }),
    });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('fake-token', 'user', 'John', 'Doe', 'fake123456');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });


  test('shows forgot password form when "Forgot Password?" is clicked', async () => {
    renderWithRouter(<Login />);
    await act(async () => {
      fireEvent.click(screen.getByText(/forgot password/i));
    });
    expect(screen.getByText(/reset password/i)).toBeInTheDocument();
  });

  test('goes through password reset flow', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ securityQuestion: 'What is your favorite color?' }),
      })
      .mockResolvedValueOnce({
        ok: true,
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    renderWithRouter(<Login />);
    
    await act(async () => {
      fireEvent.click(screen.getByText(/forgot password/i));
    });

    // Step 1: Enter username
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'test@example.com' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/what is your favorite color/i)).toBeInTheDocument();
    });

    // Step 2: Answer security question
    fireEvent.change(screen.getByLabelText(/security answer/i), { target: { value: 'Blue' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /verify/i }));
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    });

    // Step 3: Set new password
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'newpassword123' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(3);
      expect(global.alert).toHaveBeenCalledWith('Password reset successful. Please login with your new password.');
    });
  });
});