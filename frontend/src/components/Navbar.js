import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('token');

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
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    navigate('/login');
                                }}
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