import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const { isAuthenticated, userRole } = useContext(AuthContext);

    if ((isAuthenticated && userRole === 'admin') || (isAuthenticated && userRole === 'tech')) {
        return <Component {...rest} />;
    } else {
        return <Navigate to="/" replace />;
    }
};
// const PrivateRoute = ({ element: Component, ...rest }) => {

//         return <Component {...rest} />;

// };

export default PrivateRoute;