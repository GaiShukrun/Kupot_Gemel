import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyAccount from './MyAccount';
import { AuthContext } from './AuthContext';

// Mock the AuthContext
const mockAuthContext = {
  userId: '123',
  userFirstName: 'John',
  userLastName: 'Doe'
};

// Mock the TicketForm component
jest.mock('./TicketForm', () => {
  return function DummyTicketForm({ onTicketCreated }) {
    return (
      <div data-testid="ticket-form">
        <button onClick={onTicketCreated}>Submit Ticket</button>
      </div>
    );
  };
});

describe('MyAccount Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { _id: '1', title: 'Test Ticket 1', status: 'Open', createdAt: '2023-01-01' },
          { _id: '2', title: 'Test Ticket 2', status: 'Closed', createdAt: '2023-01-02' }
        ])
      })
    );
    global.localStorage = {
      getItem: jest.fn(() => 'dummy-token'),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders user information correctly', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MyAccount />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Welcome, Doe John!')).toBeInTheDocument();
  });

  test('fetches and displays user tickets', async () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MyAccount />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Ticket 1')).toBeInTheDocument();
      expect(screen.getByText('Test Ticket 2')).toBeInTheDocument();
    });
  });

  test('toggles ticket form visibility', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MyAccount />
      </AuthContext.Provider>
    );

    const toggleButton = screen.getByText('Create New Ticket');
    fireEvent.click(toggleButton);

    expect(screen.getByTestId('ticket-form')).toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(screen.queryByTestId('ticket-form')).not.toBeInTheDocument();
  });

  test('handles ticket creation', async () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MyAccount />
      </AuthContext.Provider>
    );

    const toggleButton = screen.getByText('Create New Ticket');
    fireEvent.click(toggleButton);

    const submitButton = screen.getByText('Submit Ticket');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByTestId('ticket-form')).not.toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledTimes(2); // Once on initial render, once after ticket creation
  });

  test('sorts tickets correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { _id: '1', title: 'Open Ticket', status: 'Open', createdAt: '2023-01-01' },
          { _id: '2', title: 'Closed Ticket', status: 'Closed', createdAt: '2023-01-03' },
          { _id: '3', title: 'In Progress Ticket', status: 'In progress', createdAt: '2023-01-02' }
        ])
      })
    );

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MyAccount />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      const ticketItems = screen.getAllByRole('listitem');
      expect(ticketItems[0]).toHaveTextContent('Open Ticket');
      expect(ticketItems[1]).toHaveTextContent('In Progress Ticket');
      expect(ticketItems[2]).toHaveTextContent('Closed Ticket');
    });
  });

  test('displays correct border colors for ticket status', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { _id: '1', title: 'Open Ticket', status: 'Open', createdAt: '2023-01-01' },
          { _id: '2', title: 'In Progress Ticket', status: 'In progress', createdAt: '2023-01-02' },
          { _id: '3', title: 'Closed Ticket', status: 'Closed', createdAt: '2023-01-03' }
        ])
      })
    );

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MyAccount />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      const ticketItems = screen.getAllByRole('listitem');
      expect(ticketItems[0]).toHaveStyle('border-left-color: #007bff');
      expect(ticketItems[1]).toHaveStyle('border-left-color: #ffc107');
      expect(ticketItems[2]).toHaveStyle('border-left-color: black');
    });
  });
});