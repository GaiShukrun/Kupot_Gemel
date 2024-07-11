import React from 'react';
import { render, act, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AuthContext, AuthProvider } from './AuthContext';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const TestComponent = () => {
  const { isAuthenticated, login, logout } = React.useContext(AuthContext);

  return (
    <div>
      <div data-testid="status">
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </div>
      <button onClick={login} data-testid="login-button">Login</button>
      <button onClick={logout} data-testid="logout-button">Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('initial state should be not authenticated', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('status')).toHaveTextContent('Not Authenticated');
  });

  test('should set authenticated state on login', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('login-button'));
    });

    expect(screen.getByTestId('status')).toHaveTextContent('Authenticated');
  });

  test('should remove token and set not authenticated state on logout', () => {
    localStorage.setItem('token', 'dummy-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('logout-button'));
    });

    expect(screen.getByTestId('status')).toHaveTextContent('Not Authenticated');
    expect(localStorage.getItem('token')).toBeNull(); // Token should be removed from localStorage
  });

  test('should read token from local storage and set authenticated state', () => {
    localStorage.setItem('token', 'dummy-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('status')).toHaveTextContent('Authenticated');
  });
});
