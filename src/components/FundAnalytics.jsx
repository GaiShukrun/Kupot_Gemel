import React, { useEffect, useState,useContext  } from 'react';
import { useParams } from 'react-router-dom';
import './FundAnalytics.css';
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


  return (
    <div className="fund-analytics">
      <div className="fund-header">
        <h1>{latestFund?.fundName}
        <span 
            onClick={addToFavorites} 
            style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '1.2em' }}
            role="img" 
            aria-label="Add to favorites" > ⭐
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