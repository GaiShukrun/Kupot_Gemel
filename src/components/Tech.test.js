import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tech from './Tech';

// Mocking fetch globally
global.fetch = jest.fn();

describe('Tech Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('fetches and displays tickets', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { _id: '1', title: 'Test Ticket 1', description: 'Description 1', status: 'Open', createdBy: { username: 'user1' }, forwardToAdmin: false },
        { _id: '2', title: 'Test Ticket 2', description: 'Description 2', status: 'Open', createdBy: { username: 'user2' }, forwardToAdmin: false }
      ]
    });

    render(<Tech />);

    await waitFor(() => {
      expect(screen.getByText('Test Ticket 1')).toBeInTheDocument();
      expect(screen.getByText('Test Ticket 2')).toBeInTheDocument();
    });
  });

  test('forwards ticket to admin', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { _id: '1', title: 'Test Ticket 1', description: 'Description 1', status: 'Open', createdBy: { username: 'user1' }, forwardToAdmin: false },
        { _id: '2', title: 'Test Ticket 2', description: 'Description 2', status: 'Open', createdBy: { username: 'user2' }, forwardToAdmin: false }
      ]
    });

    render(<Tech />);

    await waitFor(() => {
      expect(screen.getByText('Test Ticket 1')).toBeInTheDocument();
    });

    fetch.mockResolvedValueOnce({
      ok: true
    });

    const forwardButtons = screen.getAllByText('Forward to Admin');
    fireEvent.click(forwardButtons[0]);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/tickets/1/forward', expect.objectContaining({
        method: 'PUT'
      }));
    });
  });

  // New test: Submitting a response updates the ticket status
  test('submits a response and updates the ticket status', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { _id: '1', title: 'Test Ticket 1', description: 'Description 1', status: 'Open', createdBy: { username: 'user1' }, forwardToAdmin: false },
      ]
    });

    render(<Tech />);

    await waitFor(() => {
      expect(screen.getByText('Test Ticket 1')).toBeInTheDocument();
    });

    fetch.mockResolvedValueOnce({
      ok: true
    });

    const respondButton = screen.getByText('Respond');
    fireEvent.click(respondButton);

    const responseTextarea = screen.getByPlaceholderText('Write your response here');
    fireEvent.change(responseTextarea, { target: { value: 'This is a response.' } });

    const submitResponseButton = screen.getByText('Submit Response');
    fireEvent.click(submitResponseButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/tickets/1', expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({
          response: 'This is a response.',
          status: 'In progress'
        })
      }));
    });
  });

  // New test: Toggling the respond box
  test('toggles the respond box when clicking Respond', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { _id: '1', title: 'Test Ticket 1', description: 'Description 1', status: 'Open', createdBy: { username: 'user1' }, forwardToAdmin: false },
      ]
    });

    render(<Tech />);

    await waitFor(() => {
      expect(screen.getByText('Test Ticket 1')).toBeInTheDocument();
    });

    const respondButton = screen.getByText('Respond');
    fireEvent.click(respondButton);

    // Check if the response box appears
    expect(screen.getByPlaceholderText('Write your response here')).toBeInTheDocument();

    // Click again to close the respond box
    fireEvent.click(respondButton);

    // Check if the response box disappears
    expect(screen.queryByPlaceholderText('Write your response here')).not.toBeInTheDocument();
  });
});
