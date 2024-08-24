import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination Component', () => {
  const setup = (props) => {
    return render(<Pagination {...props} />);
  };


  test('renders pagination with the correct number of page items', () => {
    const totalFunds = 50;
    const fundsPerPage = 10;
    const currentPage = 1;
    const paginate = jest.fn();

    setup({ fundsPerPage, totalFunds, paginate, currentPage });

    // There should be 5 page numbers visible since maxPageNumbersToShow is 5
    const pageItems = screen.getAllByRole('listitem');
    expect(pageItems).toHaveLength(7); // 5 pages + "Previous" + "Next"
  });

  test('disables "Previous" button on the first page', () => {
    const totalFunds = 50;
    const fundsPerPage = 10;
    const currentPage = 1;
    const paginate = jest.fn();

    setup({ fundsPerPage, totalFunds, paginate, currentPage });

    const prevButton = screen.getByText('Previous').closest('li');
    expect(prevButton).toHaveClass('disabled');
  });

  test('disables "Next" button on the last page', () => {
    const totalFunds = 50;
    const fundsPerPage = 10;
    const currentPage = 5;
    const paginate = jest.fn();

    setup({ fundsPerPage, totalFunds, paginate, currentPage });

    const nextButton = screen.getByText('Next').closest('li');
    expect(nextButton).toHaveClass('disabled');
  });

  test('calls paginate with correct page number when a page link is clicked', () => {
    const totalFunds = 50;
    const fundsPerPage = 10;
    const currentPage = 1;
    const paginate = jest.fn();

    setup({ fundsPerPage, totalFunds, paginate, currentPage });

    fireEvent.click(screen.getByText('3').closest('a'));
    expect(paginate).toHaveBeenCalledWith(3);
  });

  test('shows ellipsis when there are more pages than maxPageNumbersToShow', () => {
    const totalFunds = 100;
    const fundsPerPage = 10;
    const currentPage = 1;
    const paginate = jest.fn();

    setup({ fundsPerPage, totalFunds, paginate, currentPage });

    expect(screen.queryByText('...')).toBeInTheDocument();
  });

  
  
    test('renders correct pagination when total pages are less than or equal to maxPageNumbersToShow', () => {
      const totalFunds = 40; // 4 pages with 10 funds per page
      const fundsPerPage = 10;
      const currentPage = 1;
      const paginate = jest.fn();
  
      setup({ fundsPerPage, totalFunds, paginate, currentPage });
  
      // Ensure all pages (1-4) are displayed
      const pageItems = screen.getAllByRole('listitem');
      expect(pageItems).toHaveLength(6); // 4 pages + "Previous" + "Next"
  
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });
  
    test('renders correct pagination when currentPage is less than or equal to maxPagesBeforeCurrentPage', () => {
      const totalFunds = 100; // 10 pages with 10 funds per page
      const fundsPerPage = 10;
      const currentPage = 2; // Close to the start
      const paginate = jest.fn();
  
      setup({ fundsPerPage, totalFunds, paginate, currentPage });
  
      // Ensure the pagination starts from the first page
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.queryByText('6')).not.toBeInTheDocument(); // Only first 5 pages are shown
    });
});
