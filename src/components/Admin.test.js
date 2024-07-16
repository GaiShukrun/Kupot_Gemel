// Admin.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for extended DOM matchers
import Admin from './Admin';

describe('Admin Component', () => {
    beforeEach(() => {
        // Mock fetch globally for the initial fetch response
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve([
                        {
                            _id: '1',
                            username: 'user1@example.com',
                            role: 'user',
                            firstname: 'John',
                            lastname: 'Doe',
                        },
                        {
                            _id: '2',
                            username: 'user2@example.com',
                            role: 'admin',
                            firstname: 'Jane',
                            lastname: 'Smith',
                        },
                    ]),
                ok: true,
            })
        );

        render(<Admin />);
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restore mock functions after each test
    });

    it('renders loading text initially', () => {
        render(<Admin />);
        expect(screen.getByText(/loading users/i)).toBeInTheDocument();
    });

    it('displays all fetched users', async () => {
        await waitFor(() => {
            expect(screen.getByText('All Users (2)')).toBeInTheDocument();
            expect(screen.getByText('user1@example.com')).toBeInTheDocument();
            expect(screen.getByText('user2@example.com')).toBeInTheDocument();
        });
    });

    it('displays error message on fetch failure', async () => {
        jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
            Promise.reject(new Error('Failed to fetch users'))
        );

        render(<Admin />);

        await waitFor(() => {
            expect(screen.getByText(/failed to fetch users/i)).toBeInTheDocument();
        });
    });

    it('deletes a user', async () => {
        // Mock delete request response
        global.fetch = jest.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([
                    {
                        _id: '1',
                        username: 'user1@example.com',
                        role: 'user',
                        firstname: 'John',
                        lastname: 'Doe',
                    },
                    {
                        _id: '2',
                        username: 'user2@example.com',
                        role: 'admin',
                        firstname: 'Jane',
                        lastname: 'Smith',
                    },
                ]),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ message: 'User deleted successfully' }),
            });

        render(<Admin />);

        await waitFor(() => expect(screen.getByText('user1@example.com')).toBeInTheDocument());

        const deleteButton = screen.getAllByText('Delete')[0]; // Get the first delete button
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.queryByText('user1@example.com')).not.toBeInTheDocument();
        });
    });

    it('adds a new user', async () => {
        // Mock initial fetch response
        global.fetch = jest.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([]), // Initially no users
            })
            // Mock add user request response
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({
                    _id: '3',
                    username: 'newuser@example.com',
                    role: 'user',
                    firstname: 'New',
                    lastname: 'User',
                }),
            })
            // Mock subsequent fetch response after adding user
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([
                    {
                        _id: '3',
                        username: 'newuser@example.com',
                        role: 'user',
                        firstname: 'New',
                        lastname: 'User',
                    },
                ]),
            });

        render(<Admin />);

        fireEvent.click(screen.getByText('Add User'));

        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'New' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'User' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'newuser@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'newpassword' } });
        fireEvent.change(screen.getByLabelText('Security Question'), {
            target: { value: "What is your mother's maiden name?" },
        });
        fireEvent.change(screen.getByLabelText('Security Answer'), { target: { value: 'Answer' } });

        fireEvent.click(screen.getByText('Add User'));

        await waitFor(() => {
            expect(screen.getByText('newuser@example.com')).toBeInTheDocument();
        });
    });
});
