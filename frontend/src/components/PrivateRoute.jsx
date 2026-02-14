import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        // Redirect to their own dashboard if unauthorized
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'doctor') return <Navigate to="/doctor" replace />;
        if (user.role === 'nurse') return <Navigate to="/nurse" replace />;
        if (user.role === 'patient') return <Navigate to="/patient/portal" replace />;
        return <Navigate to="/kiosk" replace />;
    }

    return children;
};

export default PrivateRoute;
