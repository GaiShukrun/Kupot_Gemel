// components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, user } = useContext(AuthContext);

    if (!isAuthenticated || (requiredRole && user.role !== requiredRole)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}


export default ProtectedRoute;