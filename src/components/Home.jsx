import React, { useEffect, useState,useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';
import Pagination from './Pagination';
import Tooltip from './Tooltip';
import ScrollButton from './ScrollButton'; // Adjust the import path as necessary
import { AuthContext } from './AuthContext';
import Loader from './Loader'
import LazyImage from './LazyImage';
import Swal from 'sweetalert2';


function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [funds, setFunds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fundsPerPage] = useState(25);
  const [searchTerms, setSearchTerms] = useState({});
  const [sortCriteria, setSortCriteria] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const { isAuthenticated } = useContext(AuthContext);
  const [loadingFunds, setLoadingFunds] = useState(true);
  const [loadingFeatures, setLoadingFeatures] = useState(true);
  
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));
      setUser(user);
    }
    fetchFunds();
    loadFeatures();
  }, []);

  const fetchFunds = async () => {
    setLoadingFunds(true);
    try {
      const response = await fetch('http://localhost:5000/api/funds');
      if (response.ok) {
        const data = await response.json();
        const uniqueData = removeDuplicates(data);
        setFunds(uniqueData);
      } else {
        const errorData = await response.json();
        console.error('Error fetching funds:', errorData.message);
      }
    } catch (error) {
      console.error('Error fetching funds:', error);
    } finally {
      setLoadingFunds(false); 
    }
  };


  //removing the duplicated names and keeping the latest reportPeriod
  const removeDuplicates = (funds) => {
    const uniqueFunds = {};
    const sortedFunds = funds.sort((a, b) => b.reportPeriod - a.reportPeriod);
    return sortedFunds.filter(fund => {
      if (!uniqueFunds[fund.fundName]) {
        uniqueFunds[fund.fundName] = true;
        return true;
      }
      return false;
    });
  };

  const loadFeatures = () => {
    setTimeout(() => {
      setLoadingFeatures(false);
    }, 1500);
  };

  const handleFundClick = (fundName) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Please log in to see analytics for fund ' + fundName,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      return;
    }
    navigate(`/analytics/${encodeURIComponent(fundName)}`);
  };

  const handleFeaturesButtonClick = (buttonName) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: `Please log in to see the ${buttonName}`,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (buttonName == "questionnaire")
      navigate(`/questions-form`);
    else if (buttonName == "favorite funds")
      navigate(`/favorite-funds`);
  };
  
  const handleSearch = (criteria, value) => {
    setSearchTerms(prev => ({...prev, [criteria]: value}));
    setCurrentPage(1);
  };
  const handleAddSortCriteria = (e) => {
    const [criteria, order] = e.target.value.split('-');
    if (criteria && order) {
      setSortCriteria([{criteria,order}]);
    }
  };

  
  const filteredFunds = funds.filter((fund) => {
    return Object.entries(searchTerms).every(([criteria, term]) => {
      if (criteria === 'totalAssets' || criteria === 'yearToDateYield') {
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
    <div className="landing-page">
      <main className="main">

        <section className="logo-landing">
          <div className="logo-landing-image">
            <div className="image-container-fund-list">
              <LazyImage
                src="/images/LogoText.png"
                alt="Logo"
                placeholder="/images/placeholder-LogoText.png"
              />
              {/* <img src="/images/LogoText.png" alt="Logo" /> */}
            </div>
            <div className="button-container-fund-list">
              <ScrollButton targetId="data-section" duration={1800} className="logo-landing-cta" text="↓ לרשימת קופות גמל"/>
            </div>
          </div>
        </section>
        {loadingFeatures ? (
            <Loader />
          ) : (
            <>
        <section class="features">
          <div class="features-content">
            <div class="features-image">
              <LazyImage
                src="/images/Questions-Landing.png"
                alt="Questions"
                placeholder="/images/placeholder-Questions-Landing.png"
              />
              {/* <img src="/images/Questions-Landing.png" alt="Questions" /> */}
            </div>
            <div class="features-text">
              <h2 class="features-title">תנו לנו לעזור לכם לבחור קופת גמל</h2>
              <p class="features-description">
                 מחפשים את קופת הגמל המושלמת עבורכם? בעזרת שאלון קצר,
                  מערכת הבינה המלאכותית החדשנית והייחודית שלנו תתאים לכם את הקופה הטובה ביותר,
                  בהתבסס על הצרכים וההעדפות האישיים שלכם.
                  מלאו את השאלון וקבלו את הבחירה המושלמת לחיסכון העתידי שלכם 
              </p>
              <a class="features-button" onClick={() => handleFeaturesButtonClick("questionnaire")} >לשאלון האישי</a>
            </div>  
          </div>
        </section>

        <section class="features">
          <div class="features-content">
            <div class="features-text">
              <h2 class="features-title">עקוב אחרי הקופות שמעניינות אותך</h2>
              <p class="features-description">
              אל תפספסו אף הזדמנות!
              הוסיפו את קופות הגמל המועדפות עליכם למעקב,
              ותוכלו לעקוב בקלות אחרי הביצועים שלהן.
              כך תוכלו לנהל את החיסכון שלכם בצורה חכמה יותר,
              ולעקוב אחרי כל שינוי שיכול להשפיע על העתיד הכלכלי שלכם
              </p>
              <a class="features-button" onClick={() => handleFeaturesButtonClick("favorite funds")} >למועדפים</a>
            </div>  
            <div class="features-image">
              <LazyImage
                src="/images/Favorite-Landing.png"
                alt="Questions"
                placeholder="/images/placeholder-Favorite-Landing.png"
              />
              {/* <img src="/images/Favorite-Landing.png" alt="Questions" /> */}
            </div>
          </div>
        </section>
        </>
          )}
      </main>
    </div>
    <div className="fund-list"id="data-section">
        <h2> רשימת קופות גמל </h2>
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
          <option value="yearToDateYield-asc">Year To Date Yield (Ascending)</option>
          <option value="yearToDateYield-desc">Year To Date Yield (Descending)</option>
        </select>
        </div>

        {loadingFunds ? (
        <Loader/>  
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
                  YTD Yield
                  <Tooltip text="Year To Date - The percentage return of the fund since the first trading day of the current calendar year" />
                </th>
                <th>
                  3-Year Yield
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
                  <td>{fund.yearToDateYield}%</td>
                  <td>{fund.yieldTrailing3Yrs}%</td>
                  {/* <td>
                    {(() => {
                      const period = fund.reportPeriod.toString();
                      const year = period.slice(0, 4);
                      const month = period.slice(4, 6);
                      return `${month}/${year}`;
                    })()}
                  </td> */}
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
    <footer className="footer">
        <p className="footer-text">&copy; 2024 Team 34. All rights reserved.</p>
    </footer>
    </div>
  );
}



export default Home;