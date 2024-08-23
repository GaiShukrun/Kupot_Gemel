import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import './FundAnalytics.css';
import CustomTooltip from './Tooltip';
import { AuthContext } from './AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

function FundAnalytics() {

  const { fundName } = useParams();
  const [fundData, setFundData] = useState([]);
  const [latestFund, setLatestFund] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isJittering, setIsJittering] = useState(false);

  useEffect(() => {
    const fetchFundData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/funds/${encodeURIComponent(fundName)}`);
        if (response.ok) {
          const data = await response.json();
          const sortedData = Array.isArray(data) ? data.sort((a, b) => b.reportPeriod - a.reportPeriod) : [data];
          setFundData(sortedData);
          setLatestFund(sortedData[0]);
        } else {
          console.error('Failed to fetch fund data');
        }
      } catch (error) {
        console.error('Error fetching fund data:', error);
      }
    };
  
    fetchFundData();
  }, [fundName]);

  const addToFavorites = async () => {
    if (!isAuthenticated) {
      Swal.fire({
      title: 'Authentication Required',
      text: 'Please log in to add favorites',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
    });
      return;
    }
    const token = localStorage.getItem('token');
    console.log('Token from local storage:', token);

    const fundToAdd = {
      fundId: latestFund.fundId,
      fundName: latestFund.fundName,
      fundClassification: latestFund.fundClassification,
      controllingCorporation: latestFund.controllingCorporation,
      totalAssets: latestFund.totalAssets,
      inceptionDate: latestFund.inceptionDate,
      targetPopulation: latestFund.targetPopulation,
      specialization: latestFund.specialization,
      subSpecialization: latestFund.subSpecialization,
      avgAnnualManagementFee: latestFund.avgAnnualManagementFee,
      avgDepositFee: latestFund.avgDepositFee,
      standardDeviation: latestFund.standardDeviation,
      alpha: latestFund.alpha,
      sharpeRatio: latestFund.sharpeRatio,
      historicalData: fundData
    };

    try {
      const response = await fetch('http://localhost:5000/api/users/addFavorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ fund: fundToAdd })
      });

      if (response.ok) {
        setIsFavorite(true);
        setIsJittering(true);
        setTimeout(() => setIsJittering(false), 1000);
        Swal.fire({
          title: 'Fund added to favorites!',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: errorData.message,
          icon: 'error',
          confirmButtonColor: '#3085d6',
        });
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while adding to favorites',
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  if (!latestFund) return <div>Loading...</div>;



  const BLUE_COLORS = ['#003f5c', '#2c4875', '#58508d', '#bc5090', '#ff6361', '#ffa600'];

  function convertReportPeriodToDate(reportPeriod) {
    const year = Math.floor(reportPeriod / 100);
    const month = reportPeriod % 100 - 1; // JavaScript months are 0-indexed
    return new Date(year, month, 1);
  }

  function HistoricalYieldChart({ data }) {
    const chartData = data.map(item => ({
      date: convertReportPeriodToDate(item.reportPeriod),
      monthlyYield: item.monthlyYield,
      yearToDateYield: item.yearToDateYield
    }));
  
    return (
      <div className="chart-wrapper">
        <h2>
          Historical Yield
          <CustomTooltip text="This chart presents the historical monthly and year-to-date yields of the fund." />
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis 
              dataKey="date" 
              type="category" 
              tickFormatter={(date) => date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              reversed={true}
            />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip 
              labelFormatter={(date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            />
            <Legend />
            <Line type="monotone" dataKey="monthlyYield" stroke={BLUE_COLORS[0]} name="Monthly Yield" />
            <Line type="monotone" dataKey="yearToDateYield" stroke={BLUE_COLORS[1]} name="YTD Yield" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  function HistoricalAssetsChart({ data }) {
    const chartData = data.map(item => ({
      date: convertReportPeriodToDate(item.reportPeriod),
      totalAssets: item.totalAssets
    }));
  
    return (
      <div className="chart-wrapper">
        <h2>
          Total Assets Over Time
          <CustomTooltip text="This chart shows how the total assets managed by the fund have changed over time." />
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis 
              dataKey="date" 
              type="category" 
              tickFormatter={(date) => date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              reversed={true}
            />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip 
              labelFormatter={(date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            />
            <Line type="monotone" dataKey="totalAssets" stroke={BLUE_COLORS[2]} name="Total Assets" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  function prepareYieldPerformanceData(data) {
    return data.map(item => ({
      date: convertReportPeriodToDate(item.reportPeriod),
      monthly: item.monthlyYield,
      ytd: item.yearToDateYield,
      threeYears: item.yieldTrailing3Yrs,
      fiveYears: item.yieldTrailing5Yrs
    }));
  }
  
  function prepareFundExposuresData(data) {
    return data.map(item => ({
      date: convertReportPeriodToDate(item.reportPeriod),
      liquidAssets: item.liquidAssetsPercent,
      stockMarket: item.stockMarketExposure,
      foreign: item.foreignExposure,
      foreignCurrency: item.foreignCurrencyExposure
    }));
  }
  
  function prepareAssetAllocationData(data) {
    return data.map(item => ({
      date: convertReportPeriodToDate(item.reportPeriod),
      liquidAssets: item.liquidAssetsPercent,
      stockMarket: item.stockMarketExposure,
      foreign: item.foreignExposure,
      foreignCurrency: item.foreignCurrencyExposure
    }));
  }


  function YieldPerformanceChart({ data }) {
    const chartData = prepareYieldPerformanceData(data);
    
    return (
      <div className="chart-wrapper">
        <h2>
          Yield Performance
          <CustomTooltip text="This chart shows the fund's yield performance over time." />
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis 
              dataKey="date" 
              type="category" 
              tickFormatter={(date) => date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              reversed={true}
            />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip labelFormatter={(date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
            <Legend />
            <Line type="monotone" dataKey="monthly" name="Monthly" stroke={BLUE_COLORS[0]} />
            <Line type="monotone" dataKey="ytd" name="YTD" stroke={BLUE_COLORS[1]} />
            <Line type="monotone" dataKey="threeYears" name="3 Years" stroke={BLUE_COLORS[2]} />
            <Line type="monotone" dataKey="fiveYears" name="5 Years" stroke={BLUE_COLORS[3]} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  function FundExposuresChart({ data }) {
    const chartData = prepareFundExposuresData(data);
    
    return (
      <div className="chart-wrapper">
        <h2>
          Fund Exposures
          <CustomTooltip text="This chart displays the fund's exposure to different asset classes over time." />
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis 
              dataKey="date" 
              type="category" 
              tickFormatter={(date) => date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              reversed={true}
            />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip labelFormatter={(date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
            <Legend />
            <Bar dataKey="liquidAssets" name="Liquid Assets" stackId="a" fill={BLUE_COLORS[0]} />
            <Bar dataKey="stockMarket" name="Stock Market" stackId="a" fill={BLUE_COLORS[1]} />
            <Bar dataKey="foreign" name="Foreign" stackId="a" fill={BLUE_COLORS[2]} />
            <Bar dataKey="foreignCurrency" name="Foreign Currency" stackId="a" fill={BLUE_COLORS[3]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  function AssetAllocationChart({ data }) {
    const chartData = prepareAssetAllocationData(data);
    const latestData = chartData[chartData.length - 1];
    
    return (
      <div className="chart-wrapper">
        <h2>
          Asset Allocation
          <CustomTooltip text="This pie chart shows the current allocation of the fund's assets." />
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: 'Liquid Assets', value: latestData.liquidAssets },
                { name: 'Stock Market', value: latestData.stockMarket },
                { name: 'Foreign', value: latestData.foreign },
                { name: 'Foreign Currency', value: latestData.foreignCurrency }
              ]}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {BLUE_COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const downloadPDF = async () => {
    const element = document.querySelector('.fund-analytics');
    const canvas = await html2canvas(element);
    const dataURL = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(dataURL);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    pdf.addImage(dataURL, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${latestFund?.fundName}.pdf`);
  };

  return (
    <div className="fund-analytics">
      <div className="fund-header">
        <h1>{latestFund?.fundName}
        <span
            className="emoji-animation"
            onClick={addToFavorites}
            style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '1.2em' }}
            role="img"
            aria-label="Add to favorites"
            title="Add to favorites"
          >
            ⭐
          </span>
          <span
            className="emoji-animation"
            onClick={downloadPDF}
            style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '1.2em' }}
            role="img"
            aria-label="Download PDF"
            title="Download PDF"
          >
            📄
          </span>
        </h1>
        <div className="fund-details">
          <div className="detail-item">
            <span className="detail-label">Classification:</span>
            <span className="detail-value">{latestFund.fundClassification}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Controlling Corporation:</span>
            <span className="detail-value">{latestFund.controllingCorporation}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Total Assets:</span>
            <span className="detail-value">{latestFund.totalAssets}</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
      <YieldPerformanceChart data={fundData} />
      <FundExposuresChart data={fundData} />
      <AssetAllocationChart data={fundData} />
      <HistoricalYieldChart data={fundData} />
      <HistoricalAssetsChart data={fundData} />
      </div>

      <div className="additional-info">
        <h2>Additional Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Inception Date:</span>
            <span className="info-value">{new Date(latestFund.inceptionDate).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Target Population:</span>
            <span className="info-value">{latestFund.targetPopulation}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Specialization:</span>
            <span className="info-value">{latestFund.specialization}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Sub-Specialization:</span>
            <span className="info-value">{latestFund.subSpecialization}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Average Annual Management Fee:</span>
            <span className="info-value">{latestFund.avgAnnualManagementFee}%</span>
          </div>
          <div className="info-item">
            <span className="info-label">Average Deposit Fee:</span>
            <span className="info-value">{latestFund.avgDepositFee}%</span>
          </div>
          <div className="info-item">
            <span className="info-label">Standard Deviation:</span>
            <span className="info-value">{latestFund.standardDeviation}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Alpha:</span>
            <span className="info-value">{latestFund.alpha}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Sharpe Ratio:</span>
            <span className="info-value">{latestFund.sharpeRatio}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FundAnalytics;