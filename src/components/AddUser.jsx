import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddUser.css'; 


function AddUser() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [role, setRole] = useState('user');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, firstname, lastname, securityQuestion, securityAnswer, role })
        });
        if (response.ok) {
            alert('User added successfully');
            navigate('/admin');
        } else {
            alert('Error adding user');
        }
    };

    return (
        <div className="add-user-container">
            <h2>Add New User</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="firstname">First Name</label>
                    <input type="text" id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="lastname">Last Name</label>
                    <input type="text" id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="username">Email</label>
                    <input type="email" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="securityQuestion">Security Question</label>
                    <select id="securityQuestion" value={securityQuestion} onChange={(e) => setSecurityQuestion(e.target.value)} required>
                        <option value="">Select a question</option>
                        <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                        <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                        <option value="What was the name of your elementary school?">What was the name of your elementary school?</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="securityAnswer">Security Answer</label>
                    <input type="text" id="securityAnswer" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="role">Role</label>
                    <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                        <option value="user">User</option>
                        <option value="tech">Tech</option>
                    </select>
                </div>
                <button type="submit">Add User</button>
            </form>
        </div>
    );
}

export default AddUser;