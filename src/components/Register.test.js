import React from 'react';
import { render, screen, fireEvent,waitFor  } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register, { validEmail, validPassword } from './Register';
import Swal from 'sweetalert2';

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

describe('Register Component', () => {
    test('renders Register component', () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );

        expect(screen.getByTitle('BUT')).toBeInTheDocument();
        expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Security Question')).toBeInTheDocument();
        expect(screen.getByLabelText('Security Answer')).toBeInTheDocument();
    });

    test('validates email format', () => {
        expect(validEmail.test('test@example.com')).toBe(true);
        expect(validEmail.test('invalid-email')).toBe(false);
    });

    test('validates password format', () => {
        expect(validPassword.test('Password123')).toBe(true);
        expect(validPassword.test('pass')).toBe(false);
    });

    test('shows error for invalid email', async () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );
    
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123' } });
        fireEvent.click(screen.getByTitle('BUT'));
    
        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalled();
        });
    });

    test('shows error for invalid password', async () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );
    
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass' } });
        fireEvent.click(screen.getByTitle('BUT'));
    
        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalled();
        });
    });

    test('submits the form with valid inputs', () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123' } });
        fireEvent.change(screen.getByLabelText('Security Question'), { target: { value: 'What is your mother\'s maiden name?' } });
        fireEvent.change(screen.getByLabelText('Security Answer'), { target: { value: 'Smith' } });

        fireEvent.click(screen.getByTitle('BUT'));

        // You can mock fetch and check if it was called with the correct arguments
        // For example:
        // expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/register', expect.anything());
    });
});