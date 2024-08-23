// FavoriteFunds.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loader from './Loader';
import './FavoriteFunds.css';

function FavoriteFunds() {
  const [favoriteFunds, setFavoriteFunds] = useState([]);
  const { isAuthenticated, userId } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated ) {
      fetchFavoriteFunds();
    }
  }, [isAuthenticated, userId]);

  const fetchFavoriteFunds = async () => {
    console.log(userId);
    setIsLoading(true);
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
    } finally {
      setIsLoading(false); 
    }
  };


  const handleRowClick = (fundName) => {
    navigate(`/analytics/${encodeURIComponent(fundName)}`);
  };
  
  const handleRemove = async (fundId, event) => {
    event.stopPropagation(); // Prevent row click event from firing
  
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove'
      });
  
      if (result.isConfirmed) {
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
          
          Swal.fire(
            'Removed!',
            'The fund has been removed from your favorites.',
            'success'
          );
        } else {
          const errorData = await response.json();
          Swal.fire(
            'Error',
            errorData.message || 'Failed to remove fund from favorites',
            'error'
          );
        }
      }
    } catch (error) {
      console.error('Error removing fund from favorites:', error);
      Swal.fire(
        'Error',
        'An unexpected error occurred while removing the fund',
        'error'
      );
    }
  };
  
  return (
    <div className="favorite-funds">
      <h2>My Favorite Funds</h2>
      {isLoading ? (
        <Loader/>
      ) : favoriteFunds.length > 0 ? (
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
      ) : (
        <h3>No favorite funds found! <a href="/">Click here</a> to see all funds</h3>
      )}
    </div>
  );
}


export default FavoriteFunds;