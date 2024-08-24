import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import FavoriteFunds from './FavoriteFunds';
import Swal from 'sweetalert2';
jest.mock('sweetalert2');

// Mock the fetch function
global.fetch = jest.fn();

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockFavoriteFunds = [
  { fundId: '1', fundName: 'Fund A', fundClassification: 'Type A', totalAssets: 1000000 },
  { fundId: '2', fundName: 'Fund B', fundClassification: 'Type B', totalAssets: 2000000 },
];

const renderWithContext = (ui, { isAuthenticated = true, userId = 'testUserId' } = {}) => {
  return render(
    <AuthContext.Provider value={{ isAuthenticated, userId }}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('FavoriteFunds Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
    localStorage.clear();
    localStorage.setItem('token', 'testtoken');
  });

  test('renders favorite funds when authenticated', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFavoriteFunds),
    });

    renderWithContext(<FavoriteFunds />);

    await waitFor(() => {
      expect(screen.getByText('My Favorite Funds')).toBeInTheDocument();
      expect(screen.getByText('Fund A')).toBeInTheDocument();
      expect(screen.getByText('Fund B')).toBeInTheDocument();
    });
  });

  test('does not fetch funds when not authenticated', () => {
    renderWithContext(<FavoriteFunds />, { isAuthenticated: false });

    expect(fetch).not.toHaveBeenCalled();
  });

  test('navigates to fund analytics when row is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFavoriteFunds),
    });

    renderWithContext(<FavoriteFunds />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Fund A'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/analytics/Fund%20A');
  });

  test('removes fund when remove button is clicked and confirmed', async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFavoriteFunds),
    }).mockResolvedValueOnce({
      ok: true,
    });
  
    renderWithContext(<FavoriteFunds />);
  
    await waitFor(() => {
      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[0]);
    });
  
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
    });
  
    await waitFor(() => {
      expect(screen.queryByText('Fund A')).not.toBeInTheDocument();
      expect(screen.getByText('Fund B')).toBeInTheDocument();
    });
  });

  test('handles fetch error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    fetch.mockRejectedValueOnce(new Error('Fetch error'));

    renderWithContext(<FavoriteFunds />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching favorite funds:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test('handles remove error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFavoriteFunds),
    }).mockRejectedValueOnce(new Error('Network error'));
  
    renderWithContext(<FavoriteFunds />);
  
    await waitFor(() => {
      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[0]);
    });
  
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
    });
  
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error removing fund from favorites:',
        expect.any(Error)
      );
    });
  
    consoleSpy.mockRestore();
  });
});