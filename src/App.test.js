import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Navbar', () => {
  render(<App />);
  const navbarElement = screen.getByTestId('navbar');
  expect(navbarElement).toBeInTheDocument();
});