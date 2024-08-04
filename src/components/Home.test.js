import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import { act } from 'react';  // Import act from 'react' instead of 'react-dom/test-utils'

// Mock the fetch function
global.fetch = jest.fn();

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockFunds = [
  { _id: '1', fundName: 'Fund A', fundClassification: 'Type A', controllingCorporation: 'Corp A', totalAssets: 1000000, monthlyYield: 5 },
  { _id: '2', fundName: 'Fund B', fundClassification: 'Type B', controllingCorporation: 'Corp B', totalAssets: 2000000, monthlyYield: 6 },
];

describe('Home Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockFunds),
    });
  });

  test('renders Home component', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
    });
    
    expect(screen.getByText('Fund Name')).toBeInTheDocument();
    expect(screen.getByText('Classification')).toBeInTheDocument();
    expect(screen.getByText('Controlling Corporation')).toBeInTheDocument();
    expect(screen.getByText('Total Assets')).toBeInTheDocument();
    expect(screen.getByText('Monthly Yield')).toBeInTheDocument();
  });

  test('fetches and displays funds', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
    });
    
    expect(screen.getByText('Fund A')).toBeInTheDocument();
    expect(screen.getByText('Fund B')).toBeInTheDocument();
  });

  test('filters funds based on search input', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
    });
    
    const searchInput = screen.getByPlaceholderText('Search Fund Name...');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Fund A' } });
    });
    
    expect(screen.getByText('Fund A')).toBeInTheDocument();
    expect(screen.queryByText('Fund B')).not.toBeInTheDocument();
  });

  test('sorts funds when sort criteria is selected', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
    });
    
    const sortSelect = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(sortSelect, { target: { value: 'totalAssets-desc' } });
    });
    
    const fundRows = screen.getAllByRole('row').slice(1); // Exclude header row
    expect(fundRows[0]).toHaveTextContent('Fund B');
    expect(fundRows[1]).toHaveTextContent('Fund A');
  });

  test('navigates to fund analytics page when a fund is clicked', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
    });
    
    const fundRow = screen.getByText('Fund A').closest('tr');
    await act(async () => {
      fireEvent.click(fundRow);
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/analytics/Fund%20A');
  });

  test('displays correct pagination', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
    });
    
    const pageOneLink = screen.getByText('1');
    expect(pageOneLink).toBeInTheDocument();
    expect(pageOneLink.closest('li')).toHaveClass('active');  // Check if the parent li has the 'active' class
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});