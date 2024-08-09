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
import Questions_Form from './components/Questions_Form';
import RecommendedFunds from './components/RecommendedFunds';
import FundAnalytics from './components/FundAnalytics';
import FavoriteFunds from './components/FavoriteFunds';
import AboutUs from './components/AboutUs';

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
                        <Route path="/analytics/:fundName" element={<FundAnalytics />} />
                        <Route path="/questions-form" element={<Questions_Form />} />
                        <Route path="/favorite-funds" element={ <FavoriteFunds/> } />
                        <Route path="/recommended-funds" element={< RecommendedFunds />} />
                        <Route path="/about-us" element={<AboutUs />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
