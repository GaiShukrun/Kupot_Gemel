import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TicketForm from './TicketForm';

describe('TicketForm', () => {
  const mockOnTicketCreated = jest.fn();

  beforeEach(() => {
    // Clear any previous mocks
    jest.resetAllMocks();
  });

  test('renders the form and submits a ticket', async () => {
    render(<TicketForm userId="123" onTicketCreated={mockOnTicketCreated} />);

    // Check if input fields are rendered
    const titleInput = screen.getByPlaceholderText('Title');
    const descriptionTextarea = screen.getByPlaceholderText('Description');
    const submitButton = screen.getByText('Submit Ticket');

    expect(titleInput).toBeInTheDocument();
    expect(descriptionTextarea).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    // Fill out the form
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionTextarea, { target: { value: 'Test Description' } });

    // Mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Ticket created successfully' }),
      })
    );

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for the fetch to complete
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Check if fetch was called with correct arguments
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/create-ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        userId: '123',
        title: 'Test Title',
        description: 'Test Description',
      }),
    });

    // Check if onTicketCreated was called
    expect(mockOnTicketCreated).toHaveBeenCalledTimes(1);

    // Clean up the mock
    global.fetch.mockClear();
  });

  test('handles fetch error correctly', async () => {
    render(<TicketForm userId="123" onTicketCreated={mockOnTicketCreated} />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Test Description' } });

    // Mock the fetch function to throw an error
    global.fetch = jest.fn(() => Promise.reject(new Error('Failed to submit ticket')));

    // Submit the form
    fireEvent.click(screen.getByText('Submit Ticket'));

    // Wait for the fetch to complete
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Check if fetch was called
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/create-ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        userId: '123',
        title: 'Test Title',
        description: 'Test Description',
      }),
    });

    // Ensure onTicketCreated is not called
    expect(mockOnTicketCreated).not.toHaveBeenCalled();

    // Clean up the mock
    global.fetch.mockClear();
  });
});
