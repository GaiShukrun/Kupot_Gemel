import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [forgotPassword, setForgotPassword] = useState(false);
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resetStep, setResetStep] = useState(0); // 0: username, 1: security question, 2: new password
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                login(data.token, data.user.role, data.user.firstname, data.user.lastname);
                if (data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                const errorData = await response.json();
                alert(`Error logging in: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred while logging in');
        }
    };

    const handleForgotPassword = () => {
        setForgotPassword(true);
        setResetStep(0);
    };

    const fetchSecurityQuestion = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/users/security-question?username=${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSecurityQuestion(data.securityQuestion);
                setResetStep(1);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error fetching security question:', error);
            alert('An error occurred while fetching the security question');
        } finally {
            setIsLoading(false);
        }
    };

    const verifySecurityAnswer = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/users/verify-security-answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, securityAnswer })
            });

            if (response.ok) {
                setResetStep(2);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error verifying security answer:', error);
            alert('An error occurred while verifying the security answer');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/users/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, newPassword })
            });

            if (response.ok) {
                alert('Password reset successful. Please login with your new password.');
                setForgotPassword(false);
                setPassword('');
                setNewPassword('');
                setSecurityAnswer('');
                setSecurityQuestion('');
                setResetStep(0);
            } else {
                const errorData = await response.json();
                alert(`Error resetting password: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Password reset error:', error);
            alert('An error occurred while resetting password');
        } finally {
            setIsLoading(false);
        }
    };

    if (forgotPassword) {
        return (
            <div className="login-container">
                <div className="login-form">
                    <h2>Reset Password</h2>
                    {resetStep === 0 && (
                        <div>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <button onClick={fetchSecurityQuestion} disabled={isLoading || !username} className="btn-next">
                                    {isLoading ? <span className="loading-indicator"></span> : null}
                                    {isLoading ? 'Loading...' : 'Next'}
                            </button>
                        </div>
                    )}
                    {resetStep === 1 && (
                        <div>
                            <div className="form-group">
                                <label>Security Question: {securityQuestion}</label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="securityAnswer">Security Answer</label>
                                <input
                                    type="text"
                                    id="securityAnswer"
                                    value={securityAnswer}
                                    onChange={(e) => setSecurityAnswer(e.target.value)}
                                    required
                                />
                            </div>
                            <button onClick={verifySecurityAnswer} disabled={isLoading || !securityAnswer} className="btn-verify">
                                {isLoading ? <span className="loading-indicator"></span> : null}
                                {isLoading ? 'Verifying...' : 'Verify'}
                            </button>
                        </div>
                    )}
                    {resetStep === 2 && (
                        <form onSubmit={handleResetPassword}>
                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-reset-password" disabled={isLoading}>
                                {isLoading ? <span className="loading-indicator"></span> : null}
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                    <button onClick={() => { setForgotPassword(false); setResetStep(0); }} className="btn-back">Back to Login</button>
                </div>
            </div>
        );
    }

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
                <button onClick={handleForgotPassword} className="btn-forgot-password">Forgot Password?</button>
            </div>
        </div>
    );
}

export default Login;