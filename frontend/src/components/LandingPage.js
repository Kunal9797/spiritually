import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaStar, FaUserPlus, FaSignInAlt, FaArrowRight } from 'react-icons/fa';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div>
           

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="hero-content">
                                <h1 className="hero-title">Discover Your Spiritual Path</h1>
                                <p className="hero-subtitle">
                                    Explore ancient wisdom, get personalized astrological insights, 
                                    and connect with timeless philosophical traditions.
                                </p>
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => navigate('/quick-advice')}
                                >
                                    Start Your Journey <FaArrowRight className="ms-2" />
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <img 
                                src="/images/nature.jpg" 
                                alt="Spiritual Journey" 
                                className="hero-image"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title">Our Services</h2>
                    <div className="feature-grid">
                        <div className="card">
                            <div className="feature-icon">
                                <FaStar />
                            </div>
                            <h3>Quick Consultation</h3>
                            <p>Get instant astrological guidance tailored to your birth chart</p>
                            <button 
                                className="btn btn-outline"
                                onClick={() => navigate('/quick-advice')}
                            >
                                Get Reading
                            </button>
                        </div>
                        <div className="card">
                            <div className="feature-icon">
                                <FaBook />
                            </div>
                            <h3>Knowledge Base</h3>
                            <p>Explore philosophical and spiritual traditions</p>
                            <button 
                                className="btn btn-outline"
                                onClick={() => navigate('/knowledge-base')}
                            >
                                Learn More
                            </button>
                        </div>
                        <div className="card">
                            <div className="feature-icon">
                                <FaUserPlus />
                            </div>
                            <h3>Personal Account</h3>
                            <p>Create your profile for personalized insights</p>
                            <button 
                                className="btn btn-outline"
                                onClick={() => navigate('/register')}
                            >
                                Sign Up
                            </button>
                        </div>
                        <div className="card">
                            <div className="feature-icon">
                                <FaSignInAlt />
                            </div>
                            <h3>Member Access</h3>
                            <p>Access your saved readings and insights</p>
                            <button 
                                className="btn btn-outline"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </section>

                    {/* About Section */}
            <section className="section about-section">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-image-container">
                            <img 
                                src="/images/draupadi.jpg" 
                                alt="About Us" 
                                className="about-image"
                            />
                        </div>
                        <div className="about-content">
                            <h2 className="about-title">Why Choose Us</h2>
                            <p className="about-description">
                                Experience authentic spiritual guidance through our unique blend of ancient wisdom and modern understanding.
                            </p>
                            <div className="about-features">
                                <div className="about-feature">
                                    <div className="about-feature-icon">
                                        <FaStar />
                                    </div>
                                    <div className="about-feature-content">
                                        <h4>Ancient Wisdom</h4>
                                        <p>Access traditional knowledge from various cultures</p>
                                    </div>
                                </div>
                                <div className="about-feature">
                                    <div className="about-feature-icon">
                                        <FaBook />
                                    </div>
                                    <div className="about-feature-content">
                                        <h4>Modern Insights</h4>
                                        <p>Contemporary interpretation of timeless wisdom</p>
                                    </div>
                                </div>
                                <div className="about-feature">
                                    <div className="about-feature-icon">
                                        <FaUserPlus />
                                    </div>
                                    <div className="about-feature-content">
                                        <h4>Personal Growth</h4>
                                        <p>Tools and guidance for spiritual development</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div>
                            <h5>Astro Advisor</h5>
                            <p>Your guide to spiritual wisdom</p>
                        </div>
                        <div>
                            <h5>Quick Links</h5>
                            <ul className="footer-links">
                                <li><a href="/quick-advice">Quick Consultation</a></li>
                                <li><a href="/knowledge-base">Knowledge Base</a></li>
                                <li><a href="/login">Login</a></li>
                                <li><a href="/register">Register</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5>Contact</h5>
                            <p>Email: contact@astroadvisor.com</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;