// FavoriteFunds.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './FavoriteFunds.css';

function FavoriteFunds() {
  const [favoriteFunds, setFavoriteFunds] = useState([]);
  const { isAuthenticated, userId } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavoriteFunds();
    }
  }, [isAuthenticated, userId]);

  const fetchFavoriteFunds = async () => {
    console.log(userId);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/favorite-funds`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFavoriteFunds(data);
      } else {
        console.error('Failed to fetch favorite funds');
      }
    } catch (error) {
      console.error('Error fetching favorite funds:', error);
    }
  };

  const handleRowClick = (fundName) => {
    navigate(`/analytics/${encodeURIComponent(fundName)}`);
  };
  const handleRemove = async (fundId, event) => {
    event.stopPropagation(); // Prevent row click event from firing
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/remove-favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ fundId })
      });
      if (response.ok) {
        // Remove the fund from the local state
        setFavoriteFunds(favoriteFunds.filter(fund => fund.fundId !== fundId));
      } else {
        console.error('Failed to remove fund from favorites');
      }
    } catch (error) {
      console.error('Error removing fund from favorites:', error);
    }
  };
  return (
    <div className="favorite-funds">
      <h2>My Favorite Funds</h2>
      <table>
        <thead>
          <tr>
            <th>Fund Name</th>
            <th>Classification</th>
            <th>Total Assets</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {favoriteFunds.map((fund) => (
            <tr key={fund.fundId} onClick={() => handleRowClick(fund.fundName)}>
              <td>{fund.fundName}</td>
              <td>{fund.fundClassification}</td>
              <td>{fund.totalAssets}</td>
              <td>
                <button 
                  onClick={(e) => handleRemove(fund.fundId, e)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default FavoriteFunds;