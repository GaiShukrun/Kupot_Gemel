import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ForgotPassword from './ForgotPassword';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mock alert
  });

  afterEach(() => {
    global.fetch.mockClear();
    window.alert.mockClear();
  });

  it('handles username submission correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ securityQuestion: "What is your pet's name?" }),
    });

    const { getByText, getByLabelText } = render(<ForgotPassword />);
    const input = getByLabelText('Email');
    const button = getByText('Next');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'test@example.com' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/security-question/test@example.com');
      expect(getByText(/What is your pet's name\?/)).toBeInTheDocument();
    });
  });

  it('displays an error message if username submission fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'User not found' }),
    });

    const { getByText, getByLabelText } = render(<ForgotPassword />);
    
    await act(async () => {
      fireEvent.change(getByLabelText('Email'), { target: { value: 'unknown@example.com' } });
      fireEvent.click(getByText('Next'));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(window.alert).toHaveBeenCalledWith('Error: User not found');
    });
  });
});
