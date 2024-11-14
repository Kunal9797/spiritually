import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

function Navbar() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const isLoggedIn = user && user.token;

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="navbar-brand">Spiritually</Link>
                <div>
                    {!isLoggedIn ? (
                        <>
                            <button 
                                className="btn btn-outline me-2" 
                                onClick={() => navigate('/login')}
                            >
                                <FaSignInAlt className="me-2" />
                                Login
                            </button>
                            <button 
                                className="btn btn-primary" 
                                onClick={() => navigate('/register')}
                            >
                                Get Started
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="me-3">
                                <FaUser className="me-1" />
                                {user.user.username}
                            </span>
                            <button 
                                className="btn btn-outline me-2" 
                                onClick={() => navigate('/knowledge-base')}
                            >
                                Knowledge Base
                            </button>
                            <button 
                                className="btn btn-outline me-2" 
                                onClick={() => navigate('/dashboard')}
                            >
                                Dashboard
                            </button>
                            <button 
                                className="btn btn-primary" 
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;