import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import './FundAnalytics.css';

function FundAnalytics() {
  const { fundName } = useParams();
  const [fund, setFund] = useState(null);

  useEffect(() => {
    const fetchFundData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/funds/${encodeURIComponent(fundName)}`);
        if (response.ok) {
          const data = await response.json();
          setFund(data);
        } else {
          console.error('Failed to fetch fund data');
        }
      } catch (error) {
        console.error('Error fetching fund data:', error);
      }
    };

    fetchFundData();
  }, [fundName]);

  if (!fund) return <div>Loading...</div>;

  const yieldData = [
    { name: 'Monthly', value: fund.monthlyYield },
    { name: 'YTD', value: fund.yearToDateYield },
    { name: '3 Years', value: fund.yieldTrailing3Yrs },
    { name: '5 Years', value: fund.yieldTrailing5Yrs },
  ];

  const exposureData = [
    { name: 'Liquid Assets', value: fund.liquidAssetsPercent },
    { name: 'Stock Market', value: fund.stockMarketExposure },
    { name: 'Foreign', value: fund.foreignExposure },
    { name: 'Foreign Currency', value: fund.foreignCurrencyExposure },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
                <div className="fund-analytics">
                <div className="fund-header">
            <h1>{fund.fundName}</h1>
            <div className="fund-details">
                <div className="detail-item">
                <span className="detail-label">Classification:</span>
                <span className="detail-value">{fund.fundClassification}</span>
                </div>
                <div className="detail-item">
                <span className="detail-label">Controlling Corporation:</span>
                <span className="detail-value">{fund.controllingCorporation}</span>
                </div>
                <div className="detail-item">
                <span className="detail-label">Total Assets:</span>
                <span className="detail-value">{fund.totalAssets}</span>
                </div>
            </div>
            </div>

      <div className="chart-container">
        <div className="chart-wrapper">
          <h2>Yield Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yieldData}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-wrapper">
          <h2>Fund Exposures</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={exposureData}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-wrapper">
          <h2>Asset Allocation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={exposureData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {exposureData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="additional-info">
            <h2>Additional Information</h2>
            <div className="info-grid">
                <div className="info-item">
                <span className="info-label">Inception Date:</span>
                <span className="info-value">{new Date(fund.inceptionDate).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                <span className="info-label">Target Population:</span>
                <span className="info-value">{fund.targetPopulation}</span>
                </div>
                <div className="info-item">
                <span className="info-label">Specialization:</span>
                <span className="info-value">{fund.specialization}</span>
                </div>
                <div className="info-item">
                <span className="info-label">Sub-Specialization:</span>
                <span className="info-value">{fund.subSpecialization}</span>
                </div>
                <div className="info-item">
                <span className="info-label">Average Annual Management Fee:</span>
                <span className="info-value">{fund.avgAnnualManagementFee}%</span>
                </div>
                <div className="info-item">
                <span className="info-label">Average Deposit Fee:</span>
                <span className="info-value">{fund.avgDepositFee}%</span>
                </div>
                <div className="info-item">
                <span className="info-label">Standard Deviation:</span>
                <span className="info-value">{fund.standardDeviation}</span>
                </div>
                <div className="info-item">
                <span className="info-label">Alpha:</span>
                <span className="info-value">{fund.alpha}</span>
                </div>
                <div className="info-item">
                <span className="info-label">Sharpe Ratio:</span>
                <span className="info-value">{fund.sharpeRatio}</span>
                </div>
            </div>
            </div>
    </div>
  );
}

export default FundAnalytics;
