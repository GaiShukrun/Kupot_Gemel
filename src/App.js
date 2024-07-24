import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Admin from './components/Admin';
import PrivateRoute from './components/PrivateRoute'; 
import AddUser from './components/AddUser';
import Questions_Form from './components/Questions_Form'; // Import the Questions_Form component

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
                        <Route path="/add-user" element={<PrivateRoute element={AddUser} />} />
                        <Route path="/questions-form" element={<Questions_Form />} /> {/* Add this route */}
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
