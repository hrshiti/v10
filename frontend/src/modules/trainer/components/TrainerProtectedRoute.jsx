import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const TrainerProtectedRoute = () => {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userData);
        if (user.role !== 'trainer') {
            return <Navigate to="/" replace />;
        }
    } catch (e) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default TrainerProtectedRoute;
