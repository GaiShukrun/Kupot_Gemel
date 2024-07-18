// Register.js
import React, { useState } from 'react';
import './Register.css'; // Import your custom CSS for Register page styling
import { useNavigate } from 'react-router-dom';

export const validEmail = new RegExp(
    '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
 );
 export const validPassword = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$');

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const[firstname,setFirstname] = useState('');
    const[lastname,setLastname] = useState('');
    const[securityQuestion,setSecurityQuestion]=useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const role = 'user';

    const [error, setError] = useState('');
    const navigate = useNavigate();
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validEmail.test(username)) {
            alert('Invalid email address');

            setError('Invalid email address');
            return;
        }

        if (!validPassword.test(password)) {
            alert('Password must be at least 6 characters long and contain at least one letter and one number');
            setError('Password must be at least 6 characters long and contain at least one letter and one number');
            return;
        }

        setError('');
        const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            

            body: JSON.stringify({ username, password, firstname, lastname, securityQuestion, securityAnswer,role })
        });
        if (response.ok) {
            alert('User registered');
            navigate('/login');
        } else {
            alert('Error registering user');
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                <div className="form-group">
                        <label htmlFor="firstname">First Name</label>
                        <input
                            type="text"
                            id="firstname"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname">Last Name</label>
                        <input
                            type="text"
                            id="lastname"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                        />
                    </div>
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
                    <div className="form-group">
                        <label htmlFor="securityQuestion">Security Question</label>
                        <select
                            id="securityQuestion"
                            value={securityQuestion}
                            onChange={(e) => setSecurityQuestion(e.target.value)}
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
                            value={securityAnswer}
                            onChange={(e) => setSecurityAnswer(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-register">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;
