import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Pagination from './Pagination';
import Tooltip from './Tooltip';



function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [funds, setFunds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fundsPerPage] = useState(25);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));
      setUser(user);
    }
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/funds');
      if (response.ok) {
        const data = await response.json();
        setFunds(data);
      } else {
        const errorData = await response.json();
        console.error('Error fetching funds:', errorData.message);
      }
    } catch (error) {
      console.error('Error fetching funds:', error);
    }
  };

  const handleButtonClick = () => {
    navigate('/questions-form');
  };

  // Get current funds
  const indexOfLastFund = currentPage * fundsPerPage;
  const indexOfFirstFund = indexOfLastFund - fundsPerPage;
  const currentFunds = funds.slice(indexOfFirstFund, indexOfLastFund);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    //<div dir="rtl"></div>
    <div >
  
      
      {user ? (
        <button className="questions-form-button" onClick={handleButtonClick}>
          Questions Form
        </button>
      ) : (
        <p>Please log in to access the questionnaire.</p>
      )}

      <h2>Available Funds</h2>
      <div className="funds-table-container" >
        <table className="funds-table">
          <thead>
            <tr>
              <th>Fund Name</th>
              <th >
                Classification
                <Tooltip text="The category or type of the fund" /> </th>
              <th>
                Controlling Corporation
                <Tooltip text="The company that controls or manages the fund" />
                </th>
              <th>
                Total Assets
                <Tooltip text="The total value of assets managed by the fund" />
                </th>
              <th>
                Monthly Yield
                <Tooltip text="The percentage return of the fund over the last month" />
                </th>
            </tr>
          </thead>
          <tbody>
            {currentFunds.map((fund) => (
              <tr key={fund._id}>
                <td>{fund.fundName}</td>
                <td>{fund.fundClassification}</td>
                <td>{fund.controllingCorporation}</td>
                <td>{fund.totalAssets}</td>
                <td>{fund.monthlyYield}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        fundsPerPage={fundsPerPage}
        totalFunds={funds.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
}



export default Home;