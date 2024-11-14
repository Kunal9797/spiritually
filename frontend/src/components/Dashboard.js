import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import authService from '../services/authService';

function Dashboard() {
    const [userProfile, setUserProfile] = useState(null);
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [profileRes, readingsRes] = await Promise.all([
                apiService.getUserProfile(),
                apiService.getReadings()
            ]);
            setUserProfile(profileRes.data);
            setReadings(readingsRes.data);
        } catch (error) {
            console.error('Dashboard data loading error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Welcome, {userProfile?.username}</h2>
                <button onClick={handleLogout} className="btn btn-outline-danger">
                    Logout
                </button>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Your Profile</h5>
                    <p>Email: {userProfile?.email}</p>
                    <p>Birth Date: {userProfile?.birth_date}</p>
                    <p>Location: {userProfile?.location}</p>
                </div>
            </div>

            <h3>Your Readings</h3>
            {readings.length === 0 ? (
                <p>No readings yet.</p>
            ) : (
                <div className="list-group">
                    {readings.map((reading) => (
                        <div key={reading.id} className="list-group-item">
                            <h5>{reading.name}</h5>
                            <p>{reading.advice}</p>
                            <small className="text-muted">
                                Created: {new Date(reading.created_at).toLocaleDateString()}
                            </small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;