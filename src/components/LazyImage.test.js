import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import LazyImage from './LazyImage';

describe('LazyImage Component', () => {
  const mockProps = {
    src: 'https://example.com/image.jpg',
    alt: 'Test Image',
    placeholder: 'https://example.com/placeholder.jpg',
  };

  let mockIntersectionObserver;
  let mockObserve;
  let mockUnobserve;
  let mockDisconnect;

  beforeEach(() => {
    mockObserve = jest.fn();
    mockUnobserve = jest.fn();
    mockDisconnect = jest.fn();

    mockIntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    }));

    window.IntersectionObserver = mockIntersectionObserver;
  });

  test('renders with placeholder initially', () => {
    render(<LazyImage {...mockProps} />);
    const image = screen.getByAltText('Test Image');
    expect(image).toHaveAttribute('src', mockProps.placeholder);
    expect(image).toHaveStyle('opacity: 0.5');
  });

  test('loads actual image when intersecting', () => {
    render(<LazyImage {...mockProps} />);
    const image = screen.getByAltText('Test Image');
    
    act(() => {
      const [observerCallback] = mockIntersectionObserver.mock.calls[0];
      observerCallback([{ isIntersecting: true }]);
    });

    expect(image).toHaveAttribute('src', mockProps.src);
    expect(image).toHaveStyle('opacity: 1');
  });

  test('does not load actual image when not intersecting', () => {
    render(<LazyImage {...mockProps} />);
    const image = screen.getByAltText('Test Image');
    
    act(() => {
      const [observerCallback] = mockIntersectionObserver.mock.calls[0];
      observerCallback([{ isIntersecting: false }]);
    });

    expect(image).toHaveAttribute('src', mockProps.placeholder);
    expect(image).toHaveStyle('opacity: 0.5');
  });

  test('applies correct styles', () => {
    render(<LazyImage {...mockProps} />);
    const image = screen.getByAltText('Test Image');
    expect(image).toHaveStyle('transition: opacity 0.3s');
  });

  test('unobserves on unmount', () => {
    const { unmount } = render(<LazyImage {...mockProps} />);
    unmount();
    expect(mockUnobserve).toHaveBeenCalled();
  });
});