import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader Component', () => {
  test('renders without crashing', () => {
    render(<Loader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('has correct CSS classes', () => {
    render(<Loader />);
    const loaderElement = screen.getByText('Loading...').parentElement;
    expect(loaderElement).toHaveClass('loader');
    expect(loaderElement.firstChild).toHaveClass('spinner');
  });

  test('spinner is present', () => {
    render(<Loader />);
    expect(screen.getByText('Loading...').previousSibling).toHaveClass('spinner');
  });

  test('loading text is present', () => {
    render(<Loader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('loader structure is correct', () => {
    const { container } = render(<Loader />);
    expect(container.firstChild.childNodes.length).toBe(2);
    expect(container.firstChild.firstChild).toHaveClass('spinner');
    expect(container.firstChild.lastChild.tagName).toBe('P');
  });
});