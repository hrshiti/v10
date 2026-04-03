import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    let token = null;
    let userData = null;

    try {
        token = localStorage.getItem('userToken');
        userData = localStorage.getItem('userData');
    } catch (e) {
        console.error("Critical: LocalStorage access blocked", e);
        // If localStorage is blocked (e.g. iOS private mode/in-app), we can't authenticate
        return <Navigate to="/login" replace />;
    }

    if (!token) {
        // Redirect to login if there is no token
        return <Navigate to="/login" replace />;
    }

    // Role-based redirection if user lands on member routes
    try {
        if (userData) {
            const user = JSON.parse(userData);
            if (user && user.role === 'trainer') {
                return <Navigate to="/trainer" replace />;
            }
        }
    } catch (e) {
        console.error("Auth error in ProtectedRoute:", e);
        // If data is corrupt, clear and redirect
        try {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
        } catch (err) {}
        return <Navigate to="/login" replace />;
    }

    // If token exists and is a member, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
