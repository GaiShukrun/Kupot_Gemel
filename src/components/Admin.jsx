import React, { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        securityQuestion: '',
        securityAnswer: '',
        role: 'user',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
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
                throw new Error('Failed to fetch users');
            }
        } catch (error) {
            setError('Failed to fetch users. Please refresh the page to try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setUsers(users.filter(user => user._id !== userId));
            } else {
                const errorData = await response.json();
                setError(`Failed to delete user: ${errorData.message}`);
            }
        } catch (error) {
            setError('Failed to delete user. Please try again.');
        }
    };

    const addUser = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                const addedUser = await response.json();
                setUsers([...users, addedUser]); // Update local state with the new user
                // Fetch updated list of users
                await fetchUsers();
                setNewUser({
                    username: '',
                    password: '',
                    firstname: '',
                    lastname: '',
                    securityQuestion: '',
                    securityAnswer: '',
                    role: 'user',
                });
                setShowAddUserForm(false);
            } else {
                const errorData = await response.json();
                setError(`Failed to add user: ${errorData.message}`);
            }
        } catch (error) {
            setError('Failed to add user. Please try again.');
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const toggleAddUserForm = () => {
        setShowAddUserForm(!showAddUserForm);
    };

    if (isLoading) {
        return <div className="loading">Loading users...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="admin-container">
            <h1>Admin Page</h1>
            <button className="add-button" onClick={toggleAddUserForm}>
                {showAddUserForm ? 'Cancel' : 'Add User'}
            </button>
            {showAddUserForm && (
                <form className="add-user-form" onSubmit={addUser}>
                    <h2>Add User</h2>
                    <div className="form-group">
                        <label htmlFor="firstname">First Name</label>
                        <input
                            type="text"
                            id="firstname"
                            name="firstname"
                            value={newUser.firstname}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname">Last Name</label>
                        <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            value={newUser.lastname}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Email</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={newUser.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={newUser.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="securityQuestion">Security Question</label>
                        <select
                            id="securityQuestion"
                            name="securityQuestion"
                            value={newUser.securityQuestion}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select a question</option>
                            <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                            <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                            <option value="What was the name of your elementary school?">What was the name of your elementary school?</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="securityAnswer">Security Answer</label>
                        <input
                            type="text"
                            id="securityAnswer"
                            name="securityAnswer"
                            value={newUser.securityAnswer}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={newUser.role}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="tech">Tech</option>

                        </select>
                    </div>
                    <button type="submit" className="btn-register">Add User</button>
                </form>
            )}
            {users.length > 0 ? (
                <div>
                    <h2>All Users ({users.length})</h2>
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Role</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                    <td>{user.firstname}</td>
                                    <td>{user.lastname}</td>
                                    <td>
                                        <button className="delete-button" onClick={() => deleteUser(user._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No users found</p>
            )}
        </div>
    );
};

export default Admin;
