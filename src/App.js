import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Admin from './components/Admin';
import ForgotPassword from './components/ForgotPassword';
import PrivateRoute from './components/PrivateRoute'; // Make sure to import PrivateRoute


function App() {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/admin" element={<PrivateRoute element={Admin} />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;