import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Login.css'; // Import your custom CSS for Login page styling
import { Link } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
    
        if (response.ok) {
            const data = await response.json();
            console.log(data); // Check what data is received from the server
    
            // Store token in localStorage
            localStorage.setItem('token', JSON.stringify(data.token));
            console.log(data.user.role); // Check if role is properly received
    
            // Set isAuthenticated and userRole in AuthContext
            login(data.user.role);
    
            // Navigate based on user role
            if (data.user.role === 'admin') {
                navigate('/admin'); // Redirect to admin page for admin users
            } else {
                navigate('/'); // Redirect to home page for regular users
            }
        } else {
            alert('Error logging in');
        }
    };
    
    

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Email</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="btn-login">Login</button>
                </form>
                <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
            </div>
        </div>
    );
}

export default Login;