import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RecommendedFunds.css';


function RecommendedFunds() {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [userAnswers, setUserAnswers] = useState({});
    const [recommendedFunds, setRecommendedFunds] = useState([]);
    useEffect(() => {
        const checkUserAndAnswers = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (token) {
            const user = JSON.parse(atob(token.split('.')[1]));
            setUser(user);
    
            try {
            const isAnsweredResponse = await fetch(`http://localhost:5000/api/users/isAnswered/${user.username}`);
            const isAnsweredData = await isAnsweredResponse.json();
            setHasAnswered(isAnsweredData);

            if (isAnsweredData) {
                const fundsResponse = await fetch(`http://localhost:5000/api/users/recommend-funds/${user.username}`);
                if (!fundsResponse.ok) {
                throw new Error('Network response was not ok');
                }
                const fundsData = await fundsResponse.json();
                setRecommendedFunds(fundsData);
            }
            } catch (error) {
            console.error('Error:', error);
            }
        }
        setIsLoading(false);
        };

        checkUserAndAnswers();
    }, []);




  if (isLoading) {
    return <div>Loading...</div>;
  }


  const handleFundClick = (fundName) => {
    navigate(`/analytics/${encodeURIComponent(fundName)}`);
  };


  return (
    <div className="recommended-fund-analytics">
      <h1>Recommended Funds</h1>
      {user ? (
        <div> 
          <h2>Welcome, {user.firstname} {user.lastname}!</h2>          
          {hasAnswered ? (
            <div>
            <p>Recommended Funds based on your Personal Preferences:</p>
            {recommendedFunds.length > 0 ? (
                <div>
                {recommendedFunds.map((fund, index) => (
                 <div className="recommended-fund-header" key={index} onClick={() => handleFundClick(fund.fundName)}>
                 {/* <div className="fund-header" key={index} > */}
                    <h1>{fund.fundName}</h1>
                    <div className="recommended-fund-details">
                      <div className="recommended-detail-item">
                        <span className="recommended-detail-label">Classification:</span>
                        <span className="recommended-detail-value">{fund.fundClassification}</span>
                      </div>
                      <div className="recommended-detail-item">
                        <span className="recommended-detail-label">Controlling Corporation:</span>
                        <span className="recommended-detail-value">{fund.controllingCorporation}</span>
                      </div>
                      <div className="recommended-detail-item">
                        <span className="recommended-detail-label">Total Assets:</span>
                        <span className="recommended-detail-value">{fund.totalAssets}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No recommended funds available at the moment.</p>
            )}
          </div>
          ) : (
            <p>Please answer the <a href="/questions-form">questionnaire</a> to get personalized fund recommendations.</p>
          )}
        </div>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
}

export default RecommendedFunds;