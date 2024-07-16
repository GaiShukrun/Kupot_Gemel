import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import ForgotPassword from './ForgotPassword';


jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn(); 
  });

  afterEach(() => {
    global.fetch.mockClear(); 
    delete global.fetch; 
  });

  it('handles username submission correctly', async () => {
    const { getByText, getByLabelText } = render(<ForgotPassword />);
    const input = getByLabelText('Email');
    const button = getByText('Next');
    
    
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    
    const mockResponse = { securityQuestion: 'What is your pet\'s name?' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/security-question/test@example.com');
      
    });
  });
});
