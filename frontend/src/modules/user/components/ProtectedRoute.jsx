import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');

    if (!token) {
        // Redirect to login if there is no token
        return <Navigate to="/login" replace />;
    }

    // Role-based redirection if user lands on member routes
    try {
        const user = JSON.parse(userData);
        if (user.role === 'trainer') {
            return <Navigate to="/trainer" replace />;
        }
    } catch (e) {
        console.error("Auth error in ProtectedRoute:", e);
    }

    // If token exists and is a member, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
