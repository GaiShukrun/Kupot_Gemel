import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import FundAnalytics from './FundAnalytics';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

// Mock the fetch function
global.fetch = jest.fn();

// Mock the alert function
global.alert = jest.fn();

// Mock jsPDF and html2canvas
jest.mock('jspdf');
jest.mock('html2canvas');

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
    fundName: "Test Fund",
    fundClassification: "Test Classification",
    controllingCorporation: "Test Corp",
    totalAssets: 1000000,
    inceptionDate: "2020-01-01",
    targetPopulation: "Test Population",
    specialization: "Test Specialization",
    subSpecialization: "Test Sub-Specialization",
    avgAnnualManagementFee: 1.5,
    avgDepositFee: 0.5,
    standardDeviation: 0.1,
    alpha: 0.2,
    sharpeRatio: 1.2,
    reportPeriod: 202104
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
    jsPDF.mockClear();
    html2canvas.mockClear();
  });

  test('downloads PDF when clicking the download button', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFundData),
    });

    const mockElement = document.createElement('div');
    mockElement.className = 'fund-analytics';
    document.body.appendChild(mockElement);

    html2canvas.mockResolvedValueOnce({
      toDataURL: jest.fn().mockReturnValue('mock-data-url')
    });

    const mockPdf = {
      addImage: jest.fn(),
      save: jest.fn(),
      internal: {
        pageSize: {
          getWidth: jest.fn(() => 500),
        },
      },
      getImageProperties: jest.fn(() => ({ width: 500, height: 500 })),
    };
    jsPDF.mockReturnValueOnce(mockPdf);

    renderWithRouter(<FundAnalytics />);

    await waitFor(() => expect(screen.getByText("Test Fund")).toBeInTheDocument(), { timeout: 5000 });

    const downloadButton = screen.getByRole('img', { name: 'Download PDF' });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(html2canvas).toHaveBeenCalledWith(expect.any(Element));
      expect(jsPDF).toHaveBeenCalled();
      expect(mockPdf.addImage).toHaveBeenCalled();
      expect(mockPdf.save).toHaveBeenCalledWith('Test Fund.pdf');
    });

    document.body.removeChild(mockElement);
  });

  test('adds fund to favorites when authenticated', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFundData),
    });

    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({}),
    };
    fetch.mockResolvedValueOnce(mockResponse);

    renderWithRouter(<FundAnalytics />, { isAuthenticated: true });

    await waitFor(() => expect(screen.getByText("Test Fund")).toBeInTheDocument());

    const favoriteButton = screen.getByRole('img', { name: 'Add to favorites' });
    fireEvent.click(favoriteButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/addFavorite', expect.objectContaining({
        method: 'POST',
      }));
    });
  });

  test('shows authentication alert when unauthenticated', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFundData),
    });

    renderWithRouter(<FundAnalytics />, { isAuthenticated: false });

    await waitFor(() => expect(screen.getByText("Test Fund")).toBeInTheDocument());

    const favoriteButton = screen.getByRole('img', { name: 'Add to favorites' });
    fireEvent.click(favoriteButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
    });
  });

  test('displays loading state when fetching data', () => {
    fetch.mockReturnValueOnce(new Promise(() => {}));

    renderWithRouter(<FundAnalytics />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders charts with mock data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFundData),
    });
  
    renderWithRouter(<FundAnalytics />);
  
    await waitFor(() => {
      const lineCharts = screen.getAllByTestId('line-chart');
      const barChart = screen.getByTestId('bar-chart');
      const pieChart = screen.getByTestId('pie-chart');
      expect(lineCharts.length).toBe(3);
      expect(barChart).toBeInTheDocument();
      expect(pieChart).toBeInTheDocument();
    });
  });
  
});
