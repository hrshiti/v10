import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('userToken');

    if (!token) {
        // Redirect to login if there is no token
        return <Navigate to="/login" replace />;
    }

    // If token exists, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
