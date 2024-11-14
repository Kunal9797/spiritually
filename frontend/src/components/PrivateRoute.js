import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

function PrivateRoute({ children }) {
    const auth = authService.getCurrentUser();
    
    return auth ? children : <Navigate to="/login" />;
}

export default PrivateRoute;