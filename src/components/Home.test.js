import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Home from './Home';
import Swal from 'sweetalert2';

jest.mock('sweetalert2');

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock LazyImage component
jest.mock('./LazyImage', () => {
  return function DummyLazyImage({ src, alt }) {
    return <img src={src} alt={alt} />;
  };
});

// Mock the fetch function
global.fetch = jest.fn();

// Mock the navigation function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Home Component', () => {
  const mockAuthContext = {
    isAuthenticated: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuthContext}>
          <Home />
        </AuthContext.Provider>
      </Router>
    );
    expect(screen.getByText('רשימת קופות גמל')).toBeInTheDocument();
  });

  test('fetches funds on mount', async () => {
    const mockFunds = [
      { _id: '1', fundName: 'Fund 1', fundClassification: 'Class A', controllingCorporation: 'Corp 1', totalAssets: 1000, yearToDateYield: 5, yieldTrailing3Yrs: 15 },
      { _id: '2', fundName: 'Fund 2', fundClassification: 'Class B', controllingCorporation: 'Corp 2', totalAssets: 2000, yearToDateYield: 6, yieldTrailing3Yrs: 18 },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFunds,
    });

    render(
      <Router>
        <AuthContext.Provider value={mockAuthContext}>
          <Home />
        </AuthContext.Provider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Fund 1')).toBeInTheDocument();
      expect(screen.getByText('Fund 2')).toBeInTheDocument();
    });
  });

  test('search functionality works', async () => {
    const mockFunds = [
      { _id: '1', fundName: 'Alpha Fund', fundClassification: 'Class A', controllingCorporation: 'Corp 1', totalAssets: 1000, yearToDateYield: 5, yieldTrailing3Yrs: 15 },
      { _id: '2', fundName: 'Beta Fund', fundClassification: 'Class B', controllingCorporation: 'Corp 2', totalAssets: 2000, yearToDateYield: 6, yieldTrailing3Yrs: 18 },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFunds,
    });

    render(
      <Router>
        <AuthContext.Provider value={mockAuthContext}>
          <Home />
        </AuthContext.Provider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Alpha Fund')).toBeInTheDocument();
      expect(screen.getByText('Beta Fund')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search Fund Name...');
    fireEvent.change(searchInput, { target: { value: 'Alpha' } });

    await waitFor(() => {
      expect(screen.getByText('Alpha Fund')).toBeInTheDocument();
      expect(screen.queryByText('Beta Fund')).not.toBeInTheDocument();
    });
  });

  test('sort functionality works', async () => {
    const mockFunds = [
      { _id: '1', fundName: 'Fund A', fundClassification: 'Class A', controllingCorporation: 'Corp 1', totalAssets: 1000, yearToDateYield: 5, yieldTrailing3Yrs: 15 },
      { _id: '2', fundName: 'Fund B', fundClassification: 'Class B', controllingCorporation: 'Corp 2', totalAssets: 2000, yearToDateYield: 6, yieldTrailing3Yrs: 18 },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFunds,
    });

    render(
      <Router>
        <AuthContext.Provider value={mockAuthContext}>
          <Home />
        </AuthContext.Provider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Fund A')).toBeInTheDocument();
      expect(screen.getByText('Fund B')).toBeInTheDocument();
    });

    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'totalAssets-desc' } });

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Fund B');
      expect(rows[2]).toHaveTextContent('Fund A');
    });
  });

  test('fund click navigates to analytics page when authenticated', async () => {
    const mockFunds = [
      { _id: '1', fundName: 'Test Fund', fundClassification: 'Class A', controllingCorporation: 'Corp 1', totalAssets: 1000, yearToDateYield: 5, yieldTrailing3Yrs: 15 },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFunds,
    });

    const authenticatedContext = { ...mockAuthContext, isAuthenticated: true };

    render(
      <Router>
        <AuthContext.Provider value={authenticatedContext}>
          <Home />
        </AuthContext.Provider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Fund')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Test Fund'));

    expect(mockNavigate).toHaveBeenCalledWith('/analytics/Test%20Fund');
  });

  test('pagination changes page', async () => {
    const mockFunds = Array(30).fill().map((_, index) => ({
      _id: `${index}`,
      fundName: `Fund ${index}`,
      fundClassification: 'Class A',
      controllingCorporation: 'Corp 1',
      totalAssets: 1000,
      yearToDateYield: 5,
      yieldTrailing3Yrs: 15
    }));

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFunds,
    });

    render(
      <Router>
        <AuthContext.Provider value={mockAuthContext}>
          <Home />
        </AuthContext.Provider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Fund 0')).toBeInTheDocument();
    });

    const nextPageButton = screen.getByText('Next');
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(screen.getByText('Fund 25')).toBeInTheDocument();
      expect(screen.queryByText('Fund 0')).not.toBeInTheDocument();
    });
  });

  test('handles fetch error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Fetch failed'));

    render(
      <Router>
        <AuthContext.Provider value={mockAuthContext}>
          <Home />
        </AuthContext.Provider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByText('Fund 1')).not.toBeInTheDocument();
    });
  });

  test('sort select changes sort criteria', async () => {
    const mockFunds = [
      { _id: '1', fundName: 'Fund A', totalAssets: 1000, yearToDateYield: 5 },
      { _id: '2', fundName: 'Fund B', totalAssets: 2000, yearToDateYield: 6 },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFunds,
    });

    render(
      <Router>
        <AuthContext.Provider value={mockAuthContext}>
          <Home />
        </AuthContext.Provider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Fund A')).toBeInTheDocument();
    });

    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'yearToDateYield-desc' } });

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Fund B');
      expect(rows[2]).toHaveTextContent('Fund A');
    });
  });

  test('displays loading state', async () => {
    
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });

    global.fetch.mockImplementationOnce(() => promise);

    render(
      <Router>
        <AuthContext.Provider value={mockAuthContext}>
          <Home />
        </AuthContext.Provider>
      </Router>
    );

    resolvePromise({ ok: true, json: async () => [] });

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });

  test('fund click shows Swal alert when not authenticated', async () => {
    const mockFunds = [
      { _id: '1', fundName: 'Test Fund', fundClassification: 'Class A', controllingCorporation: 'Corp 1', totalAssets: 1000, yearToDateYield: 5, yieldTrailing3Yrs: 15 },
    ];
  
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFunds,
    });
  
    // Mock Swal.fire to return a resolved promise
    Swal.fire.mockResolvedValue({});
  
    render(
      <Router>
        <AuthContext.Provider value={mockAuthContext}>
          <Home />
        </AuthContext.Provider>
      </Router>
    );
  
    await waitFor(() => {
      expect(screen.getByText('Test Fund')).toBeInTheDocument();
    });
  
    fireEvent.click(screen.getByText('Test Fund'));
  
    expect(Swal.fire).toHaveBeenCalled();
    
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  
});