import React from 'react';
import { render, act, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import Admin from './Admin';

// Mock fetch
global.fetch = jest.fn();

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockUsers = [
  { _id: '1', username: 'user1', firstname: 'John', lastname: 'Doe', role: 'user' },
  { _id: '2', username: 'user2', firstname: 'Jane', lastname: 'Doe', role: 'admin' },
];

describe('Admin Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders Admin page with title', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <Admin />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('Admin Page')).toBeInTheDocument();
    expect(screen.getByText('All Users')).toBeInTheDocument();
  });

  test('fetches and displays users', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <Admin />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
  });

  test('displays "No users found" when there are no users', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <Admin />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  test('deletes a user when delete button is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <Admin />
        </BrowserRouter>
      );
    });

    const deleteButtons = screen.getAllByText('Delete');
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/1', expect.any(Object));
  });

  test('navigates to add user page when "Add User" button is clicked', async () => {
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <Admin />
        </BrowserRouter>
      );
    });

    const addUserButton = screen.getByText('Add User');
    fireEvent.click(addUserButton);

    expect(navigateMock).toHaveBeenCalledWith('/add-user');
  });
});