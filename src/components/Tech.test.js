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
  
  test('handles error when fetching tickets fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch tickets'));
  
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    render(<Tech />);
  
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching tickets:', expect.any(Error));
    });
  
    consoleErrorSpy.mockRestore();
  });

  test('handles error when updating ticket status fails', async () => {
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

    // Mock error response for status update
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    fetch.mockRejectedValueOnce(new Error('Failed to update status'));

    const statusDropdown = screen.getByDisplayValue('Open');
    fireEvent.change(statusDropdown, { target: { value: 'Closed' } });

    await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating status:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();  // Clean up the spy
  });

  test('handles error when forwarding ticket fails', async () => {
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

    // Mock error response for forwarding ticket
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    fetch.mockRejectedValueOnce(new Error('Failed to forward ticket'));

    const forwardButton = screen.getByText('Forward to Admin');
    fireEvent.click(forwardButton);

    await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error forwarding ticket to Admin:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();  // Clean up the spy
});

test('displays and closes the popup after forwarding a ticket', async () => {
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

    fetch.mockResolvedValueOnce({ ok: true });

    const forwardButton = screen.getByText('Forward to Admin');
    fireEvent.click(forwardButton);

    await waitFor(() => {
        expect(screen.getByText('Ticket has been successfully forwarded to the Admin!')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Ticket has been successfully forwarded to the Admin!')).not.toBeInTheDocument();
  });

test('renders "No inquiries found" when no tickets are available', async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
    });

    render(<Tech />);

    await waitFor(() => {
        expect(screen.getByText('No inquiries found')).toBeInTheDocument();
    });
  });
});
