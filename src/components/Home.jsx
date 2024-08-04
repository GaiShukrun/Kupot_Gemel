import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';

function Home() {
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




  return (
    <div>
      <h1>Kupot-Gemel</h1>
      {user ? (
        <div> 
          <h2>Welcome, {user.firstname} {user.lastname}!</h2>
          <h3>User Home Page</h3>
          <h2> Recommended Funds </h2>
          
          {hasAnswered ? (
            <div>
            <p>Recommended Funds based on your Personal Preferences:</p>
            {recommendedFunds.length > 0 ? (
              <ul>
                {recommendedFunds.map((fund, index) => (
                  <li key={index}>
                    {fund.fundName} - Score: {fund.score}
                  </li>
                ))}
              </ul>
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

export default Home;
