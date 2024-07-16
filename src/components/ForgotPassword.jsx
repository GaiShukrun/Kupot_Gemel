import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css'; 

function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const navigate = useNavigate();

    const handleSubmitUsername = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/users/security-question/${username}`);
            console.log("1");
            if (response.ok) {
                console.log("2");
                const data = await response.json();
                setSecurityQuestion(data.securityQuestion);
                setStep(2);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error fetching security question:', error);
            alert('An error occurred while fetching the security question.');
        }
    };

    const handleSubmitSecurityAnswer = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/users/verify-security-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, securityAnswer })
            });
            if (response.ok) {
                setStep(3);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error verifying security answer:', error);
            alert('An error occurred while verifying the security answer.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, newPassword })
            });
            if (response.ok) {
                alert('Password reset successfully');
                navigate('/login');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('An error occurred while resetting the password.');
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-form">
                <h2>Forgot Password</h2>
                {step === 1 && (
                    <form onSubmit={handleSubmitUsername}>
                        <div className="form-group">
                            <label htmlFor="username">Email</label>
                            <input
                                type="email"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-submit">Next</button>
                    </form>
                )}
                {step === 2 && (
                    <form onSubmit={handleSubmitSecurityAnswer}>
                        <div className="form-group">
                            <label>Security Question: {securityQuestion}</label>
                            <input
                                type="text"
                                value={securityAnswer}
                                onChange={(e) => setSecurityAnswer(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-submit">Verify</button>
                    </form>
                )}
                {step === 3 && (
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
                        <button type="submit" className="btn-submit">Reset Password</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
