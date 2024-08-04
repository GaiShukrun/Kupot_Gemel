import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import FundAnalytics from './FundAnalytics';

// Mock the fetch function
global.fetch = jest.fn();

// Mock the alert function
global.alert = jest.fn();

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

// Mock chart components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => children,
  LineChart: () => <div data-testid="line-chart" />,
  BarChart: () => <div data-testid="bar-chart" />,
  PieChart: () => <div data-testid="pie-chart" />,
  // ... mock other chart components as needed
}));
jest.mock('recharts', () => ({
    ResponsiveContainer: ({ children }) => children,
    LineChart: () => <div data-testid="line-chart" />,
    BarChart: () => <div data-testid="bar-chart" />,
    PieChart: () => <div data-testid="pie-chart" />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    CartesianGrid: () => <div />,
    Tooltip: () => <div />,
    Legend: () => <div />,
    Line: () => <div />,
    Bar: () => <div />,
    Pie: () => <div />,
    Cell: () => <div />,
  }));
const mockFundData = [
  {
    fundId: '1',
    fundName: 'Test Fund',
    fundClassification: 'Test Classification',
    controllingCorporation: 'Test Corp',
    totalAssets: 1000000,
    inceptionDate: '2020-01-01',
    targetPopulation: 'Test Population',
    specialization: 'Test Specialization',
    subSpecialization: 'Test Sub-Specialization',
    avgAnnualManagementFee: 1.5,
    avgDepositFee: 0.5,
    standardDeviation: 0.1,
    alpha: 0.2,
    sharpeRatio: 1.1,
    monthlyYield: 0.5,
    yearToDateYield: 5,
    reportPeriod: 202101,
    liquidAssetsPercent: 20,
    stockMarketExposure: 60,
    foreignExposure: 10,
    foreignCurrencyExposure: 10
  }
];

const renderWithRouter = (ui, { route = '/analytics/Test Fund', isAuthenticated = false } = {}) => {
    return render(
      <AuthContext.Provider value={{ isAuthenticated, userId: 'testUserId' }}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/analytics/:fundName" element={ui} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };
  
  describe('FundAnalytics Component', () => {
    beforeEach(() => {
      fetch.mockClear();
      alert.mockClear();
    });
  
    test('renders loading state initially', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });
  
      renderWithRouter(<FundAnalytics />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  
    test('fetches and displays fund data', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFundData),
      });
  
      renderWithRouter(<FundAnalytics />);
  
      await waitFor(() => {
        expect(screen.getByText('Test Fund')).toBeInTheDocument();
        expect(screen.getByText('Test Classification')).toBeInTheDocument();
        expect(screen.getByText('Test Corp')).toBeInTheDocument();
      });
    });
  
    test('displays charts', async () => {
        fetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockFundData),
        });
      
        renderWithRouter(<FundAnalytics />);
      
        await waitFor(() => {
          expect(screen.getAllByTestId('line-chart')).toHaveLength(3);
          expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
          expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
        });
      });
  
    test('adds fund to favorites when authenticated', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFundData),
      }).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Fund added to favorites successfully' }),
      });
  
      renderWithRouter(<FundAnalytics />, { isAuthenticated: true });
  
      await waitFor(() => {
        const favoriteButton = screen.getByRole('img', { name: 'Add to favorites' });
        fireEvent.click(favoriteButton);
      });
  
      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith('Fund added to favorites!');
      });
    });
  
    test('shows alert when trying to add to favorites while not authenticated', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFundData),
      });
  
      renderWithRouter(<FundAnalytics />, { isAuthenticated: false });
  
      await waitFor(() => {
        const favoriteButton = screen.getByRole('img', { name: 'Add to favorites' });
        fireEvent.click(favoriteButton);
      });
  
      expect(alert).toHaveBeenCalledWith('Please log in to add favorites');
    });
  
    test('displays additional information', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFundData),
      });
  
      renderWithRouter(<FundAnalytics />);
  
      await waitFor(() => {
        expect(screen.getByText('Additional Information')).toBeInTheDocument();
        expect(screen.getByText('Inception Date:')).toBeInTheDocument();
        expect(screen.getByText('Target Population:')).toBeInTheDocument();
        expect(screen.getByText('Specialization:')).toBeInTheDocument();
        expect(screen.getByText('Sub-Specialization:')).toBeInTheDocument();
        expect(screen.getByText('Average Annual Management Fee:')).toBeInTheDocument();
        expect(screen.getByText('Average Deposit Fee:')).toBeInTheDocument();
        expect(screen.getByText('Standard Deviation:')).toBeInTheDocument();
        expect(screen.getByText('Alpha:')).toBeInTheDocument();
        expect(screen.getByText('Sharpe Ratio:')).toBeInTheDocument();
      });
    });
  });