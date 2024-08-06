import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';
import Pagination from './Pagination';
import Tooltip from './Tooltip';


function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [funds, setFunds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fundsPerPage] = useState(25);
  const [searchTerms, setSearchTerms] = useState({});
  const [sortCriteria, setSortCriteria] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));
      setUser(user);
    }
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false); 
    }
  };

  const handleFundClick = (fundName) => {
    navigate(`/analytics/${encodeURIComponent(fundName)}`);
  };
  const handleSearch = (criteria, value) => {
    setSearchTerms(prev => ({...prev, [criteria]: value}));
    setCurrentPage(1);
  };
  const handleAddSortCriteria = (e) => {
    const [criteria, order] = e.target.value.split('-');
    if (criteria && order) {
      setSortCriteria(prev => [...prev, { criteria, order }]);
    }
  };

  
  const filteredFunds = funds.filter((fund) => {
    return Object.entries(searchTerms).every(([criteria, term]) => {
      if (criteria === 'totalAssets' || criteria === 'monthlyYield') {
        return String(fund[criteria]).includes(term);
      }
      return fund[criteria].toLowerCase().includes(term.toLowerCase());
    });
  });
  
  const sortedFunds = [...filteredFunds].sort((a, b) => {
    for (let { criteria, order } of sortCriteria) {
      const aValue = parseFloat(a[criteria]);
      const bValue = parseFloat(b[criteria]);
      if (aValue !== bValue) {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
    }
    return 0;
  });

  // Get current funds
  const indexOfLastFund = currentPage * fundsPerPage;
  const indexOfFirstFund = indexOfLastFund - fundsPerPage;
  //const currentFunds = funds.slice(indexOfFirstFund, indexOfLastFund);
  const currentFunds = sortedFunds.slice(indexOfFirstFund, indexOfLastFund);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
        <h2> </h2>
        <div className="search-container">
          {[
            { key: 'fundName', label: 'Fund Name' },
            { key: 'fundClassification', label: 'Classification' },
            { key: 'controllingCorporation', label: 'Controlling Corporation' }
          ].map(({ key, label }) => (
            <div key={key} className="search-item">
              <label>{label}:</label>
              <input
                type="text"
                placeholder={`Search ${label}...`}
                value={searchTerms[key] || ''}
                onChange={(e) => handleSearch(key, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="sort-container">
        <select onChange={handleAddSortCriteria}>
          <option value="">Add Sort Criteria</option>
          <option value="totalAssets-asc">Total Assets (Ascending)</option>
          <option value="totalAssets-desc">Total Assets (Descending)</option>
          <option value="monthlyYield-asc">Monthly Yield (Ascending)</option>
          <option value="monthlyYield-desc">Monthly Yield (Descending)</option>
        </select>
        <div className="sort-items">
          {sortCriteria.map(({ criteria, order }, index) => (
            <div key={index} className="sort-item">
               <span>{criteria === 'totalAssets' ? 'Total Assets' : 'Monthly Yield'} - {order === 'asc' ? 'Ascending' : 'Descending'}</span>
               <button onClick={() => setSortCriteria(prev => prev.filter((_, i) => i !== index))}>×</button>
            </div>
          ))}
          </div>
        </div>

        {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '2em'
        }}>
          <p>Loading...</p>
        </div>  
      ) : (
        <div className="funds-table-container">
          <table className="funds-table">
            <thead>
              <tr>
                <th>Fund Name</th>
                <th>
                  Classification
                  <Tooltip text="The category or type of the fund" />
                </th>
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
                <th>
                  Report Period
                </th>
              </tr>
            </thead>
            <tbody>
              {currentFunds.map((fund) => (
                <tr key={fund._id} onClick={() => handleFundClick(fund.fundName)}>
                  <td>{fund.fundName}</td>
                  <td>{fund.fundClassification}</td>
                  <td>{fund.controllingCorporation}</td>
                  <td>{fund.totalAssets}</td>
                  <td>{fund.monthlyYield}%</td>
                  <td>
                    {(() => {
                      const period = fund.reportPeriod.toString();
                      const year = period.slice(0, 4);
                      const month = period.slice(4, 6);
                      return `${month}/${year}`;
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
         fundsPerPage={fundsPerPage}
         totalFunds={sortedFunds.length}
         paginate={paginate}
         currentPage={currentPage}
      />
    </div>
  );
}



export default Home;