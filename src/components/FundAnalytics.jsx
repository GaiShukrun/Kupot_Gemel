import React, { useEffect, useState,useContext  } from 'react';
import { useParams } from 'react-router-dom';
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import './FundAnalytics.css';
import CustomTooltip from './Tooltip';  
import { AuthContext } from './AuthContext'; 

function FundAnalytics() {

  const { fundName } = useParams();
  const [fundData, setFundData] = useState([]);
  const [latestFund, setLatestFund] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

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
      alert('Please log in to add favorites');
      return;
    }

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
        alert('Fund added to favorites!');
      } else {
        const errorData = await response.json();
        alert(`Failed to add fund to favorites: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('An error occurred while adding to favorites');
    }
  };

  if (!latestFund) return <div>Loading...</div>;



  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
            />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip 
              labelFormatter={(date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            />
            <Legend />
            <Line type="monotone" dataKey="monthlyYield" stroke="#8884d8" name="Monthly Yield" />
            <Line type="monotone" dataKey="yearToDateYield" stroke="#82ca9d" name="YTD Yield" />
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
            />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip 
              labelFormatter={(date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            />
            <Line type="monotone" dataKey="totalAssets" stroke="#8884d8" name="Total Assets" />
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
            />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip labelFormatter={(date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
            <Legend />
            <Line type="monotone" dataKey="monthly" name="Monthly" stroke="#8884d8" />
            <Line type="monotone" dataKey="ytd" name="YTD" stroke="#82ca9d" />
            <Line type="monotone" dataKey="threeYears" name="3 Years" stroke="#ffc658" />
            <Line type="monotone" dataKey="fiveYears" name="5 Years" stroke="#ff8042" />
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
            />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip labelFormatter={(date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
            <Legend />
            <Bar dataKey="liquidAssets" name="Liquid Assets" stackId="a" fill="#8884d8" />
            <Bar dataKey="stockMarket" name="Stock Market" stackId="a" fill="#82ca9d" />
            <Bar dataKey="foreign" name="Foreign" stackId="a" fill="#ffc658" />
            <Bar dataKey="foreignCurrency" name="Foreign Currency" stackId="a" fill="#ff8042" />
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
              {COLORS.map((color, index) => (
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

 

  return (
    <div className="fund-analytics">
      <div className="fund-header">
        <h1>{latestFund?.fundName}
        <span 
            onClick={addToFavorites} 
            style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '1.2em' }}
            role="img" 
            aria-label="Add to favorites"
          >
            ⭐
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