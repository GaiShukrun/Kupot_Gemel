import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userFirstName, setUserFirstName] = useState(null);
    const [userLastName, setUserLastName] = useState(null);
    const [userId, setUserId] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Here, you might want to verify the token on the server
                // For now, we'll just set the authenticated state
                setIsAuthenticated(true);
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log("@@@@",payload);
                setUserRole(payload.role);
                setUserFirstName(payload.firstname);
                setUserLastName(payload.lastname);
                setUserId(payload.userId); // Add this line to set the userId

            } catch (error) {
                console.error('Error parsing token:', error);
                logout(); // Clear authentication if token parsing fails
            }
        }
    }, []);

    const login = (token, role, firstName, lastName) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setUserRole(role);
        setUserFirstName(firstName);
        setUserLastName(lastName);
        setUserId(null); // Set the userId when logging in

    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole(null);
        setUserFirstName(null);
        setUserLastName(null);
        setUserId(null);
    };


    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole,userId,userFirstName, userLastName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

};

export { AuthContext, AuthProvider };