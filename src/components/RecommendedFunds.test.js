import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import RecommendedFunds from './RecommendedFunds';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('RecommendedFunds Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  test('renders login prompt when user is not logged in', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    render(<BrowserRouter><RecommendedFunds /></BrowserRouter>);
    await waitFor(() => {
      expect(screen.getByText('Please log in.')).toBeInTheDocument();
    });
  });

  test('renders questionnaire prompt when user has not answered', async () => {
    const token = btoa(JSON.stringify({ username: 'testuser', firstname: 'John', lastname: 'Doe' }));
    mockLocalStorage.getItem.mockReturnValue(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${token}.signature`);
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(false),
    });

    render(<BrowserRouter><RecommendedFunds /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument();
      expect(screen.getByText(/Please answer/)).toBeInTheDocument();
    });
  });

  test('renders recommended funds when user has answered', async () => {
    const token = btoa(JSON.stringify({ username: 'testuser', firstname: 'John', lastname: 'Doe' }));
    mockLocalStorage.getItem.mockReturnValue(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${token}.signature`);
    global.fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(true),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          { fundName: 'Test Fund', fundClassification: 'Equity', controllingCorporation: 'Test Corp', totalAssets: '1000000' }
        ]),
      });

    render(<BrowserRouter><RecommendedFunds /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument();
      expect(screen.getByText('Recommended Funds based on your Personal Preferences:')).toBeInTheDocument();
      expect(screen.getByText('Test Fund')).toBeInTheDocument();
    });
  });

  test('handles fund click', async () => {
    const token = btoa(JSON.stringify({ username: 'testuser', firstname: 'John', lastname: 'Doe' }));
    mockLocalStorage.getItem.mockReturnValue(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${token}.signature`);
    global.fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(true),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          { fundName: 'Test Fund', fundClassification: 'Equity', controllingCorporation: 'Test Corp', totalAssets: '1000000' }
        ]),
      });

    render(<BrowserRouter><RecommendedFunds /></BrowserRouter>);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Test Fund'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/analytics/Test%20Fund');
  });

  test('handles no recommended funds', async () => {
    const token = btoa(JSON.stringify({ username: 'testuser', firstname: 'John', lastname: 'Doe' }));
    mockLocalStorage.getItem.mockReturnValue(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${token}.signature`);
    global.fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(true),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

    render(<BrowserRouter><RecommendedFunds /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('No recommended funds available at the moment.')).toBeInTheDocument();
    });
  });
});