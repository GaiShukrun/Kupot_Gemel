// components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const { isAuthenticated, userRole } = useContext(AuthContext);

    if (isAuthenticated && userRole === 'admin') {
        return <Component {...rest} />;
    } else {
        return <Navigate to="/login" replace />;
    }
};

export default PrivateRoute;