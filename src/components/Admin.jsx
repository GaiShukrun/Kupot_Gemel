import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [forwardedTickets, setForwardedTickets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
        fetchForwardedTickets(); 
    }, []);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error('Error fetching users:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Fetch only forwarded tickets
    const fetchForwardedTickets = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tickets/forwarded', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Forwarded Tickets:', data);  // Debugging log
                setForwardedTickets(data);  // Set the forwarded tickets
            } else {
                console.error('Error fetching forwarded tickets:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching forwarded tickets:', error);
        }
    };

    // Delete a user
    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                fetchUsers();  // Refresh the users list after deletion
            } else {
                console.error('Error deleting user:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Navigate to add user
    const handleAddUser = () => {
        navigate('/add-user');
    };

    return (
        <div>
            <div className="admin-header">
                <h1>Admin Page</h1>
                <button onClick={handleAddUser} className="add-user-btn">Add User</button>
            </div>

            {/* Section for Users */}
            <h2>All Users</h2>
            {users.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.firstname}</td>
                                <td>{user.lastname}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={() => handleDelete(user._id)} className="delete-btn">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No users found</p>
            )}

            {/* Section for Forwarded Tickets */}
            <h2>Forwarded Tickets</h2>
            {forwardedTickets.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Created By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forwardedTickets.map((ticket) => (
                            <tr key={ticket._id}>
                                <td>{ticket.title}</td>
                                <td>{ticket.description}</td>
                                <td>{ticket.status}</td>
                                <td>{ticket.createdBy.username}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No forwarded tickets found</p>
            )}
        </div>
    );
};

export default Admin;
