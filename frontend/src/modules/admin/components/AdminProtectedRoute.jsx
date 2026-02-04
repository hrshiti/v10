import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
    const adminInfo = localStorage.getItem('adminInfo');

    if (!adminInfo) {
        // Redirect to admin login if there is no admin info
        return <Navigate to="/admin/login" replace />;
    }

    // If admin info exists, render the child routes
    return <Outlet />;
};

export default AdminProtectedRoute;
