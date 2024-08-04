import React from 'react';

const Pagination = ({ fundsPerPage, totalFunds, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalFunds / fundsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    const maxPageNumbersToShow = 5;
    let startPage, endPage;
  
    if (pageNumbers.length <= maxPageNumbersToShow) {
      startPage = 1;
      endPage = pageNumbers.length;
    } else {
      const maxPagesBeforeCurrentPage = Math.floor(maxPageNumbersToShow / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPageNumbersToShow / 2) - 1;
  
      if (currentPage <= maxPagesBeforeCurrentPage) {
        startPage = 1;
        endPage = maxPageNumbersToShow;
      } else if (currentPage + maxPagesAfterCurrentPage >= pageNumbers.length) {
        startPage = pageNumbers.length - maxPageNumbersToShow + 1;
        endPage = pageNumbers.length;
      } else {
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }
  
    const handlePrevClick = () => {
      if (currentPage > 1) paginate(currentPage - 1);
    };
  
    const handleNextClick = () => {
      if (currentPage < pageNumbers.length) paginate(currentPage + 1);
    };
  
    return (
      <nav>
        <ul className='pagination'>
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <a onClick={handlePrevClick} href='#!' className='page-link'>
              Previous
            </a>
          </li>
          {startPage > 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
          {pageNumbers.slice(startPage - 1, endPage).map(number => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <a onClick={() => paginate(number)} href='#!' className='page-link'>
                {number}
              </a>
            </li>
          ))}
          {endPage < pageNumbers.length && <li className="page-item disabled"><span className="page-link">...</span></li>}
          <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
            <a onClick={handleNextClick} href='#!' className='page-link'>
              Next
            </a>
          </li>
        </ul>
      </nav>
    );
  };

export default Pagination;