import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token to get user information
      const user = JSON.parse(atob(token.split('.')[1])); // Assuming JWT structure
      setUser(user);
    }
  }, []);

  const handleButtonClick = () => {
    navigate('/questions-form');
  };

  return (
    <div>
      <h1>Kupot-Gemel</h1>
      {user ? (
        <button className="questions-form-button" onClick={handleButtonClick}>
          Questions Form
        </button>
      ) : (
        <p>Please log in to access the questionnaire.</p>
      )}
    </div>
  );
}

export default Home;
