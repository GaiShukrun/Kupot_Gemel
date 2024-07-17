// AddUser.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import AddUser from './AddUser';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock fetch
global.fetch = jest.fn();

describe('AddUser Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
  });

  test('submits form with user data', async () => {
    fetch.mockResolvedValueOnce({ ok: true });
  
    render(
      <BrowserRouter>
        <AddUser />
      </BrowserRouter>
    );
  
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Security Question'), { target: { value: "What is your mother's maiden name?" } });
    fireEvent.change(screen.getByLabelText('Security Answer'), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByLabelText('Role'), { target: { value: 'tech' } });
  
    fireEvent.click(screen.getByRole('button', { name: 'Add User' }));
  
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'john@example.com',
          password: 'password123',
          firstname: 'John',
          lastname: 'Doe',
          securityQuestion: "What is your mother's maiden name?",
          securityAnswer: 'Smith',
          role: 'tech'
        })
      });
    });
  
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  test('shows alert on successful user addition', async () => {
    fetch.mockResolvedValueOnce({ ok: true });
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <AddUser />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add User' }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('User added successfully');
    });
  });

  test('shows alert on user addition error', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <AddUser />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add User' }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Error adding user');
    });
  });
});