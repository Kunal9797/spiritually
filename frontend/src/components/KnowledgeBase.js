import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PhilosophyCard from './PhilosophyCard';
import ReligionCard from './ReligionCard';
import AstrologyCard from './AstrologyCard';
import authService from '../services/authService';

function KnowledgeBase() {
    const [activeTab, setActiveTab] = useState('philosophy');
    const [data, setData] = useState({
        philosophies: [],
        religions: [],
        astrologicalSystems: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const user = authService.getCurrentUser();
    const isLoggedIn = user && user.token;

    const config = {
        headers: { 
            'x-auth-token': user?.token
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Different endpoints based on auth status
                const baseUrl = isLoggedIn ? 
                    'http://localhost:5001/api/enhanced' : 
                    'http://localhost:5001/api';

                const [philosophiesRes, religionsRes, astrologyRes] = await Promise.all([
                    axios.get(`${baseUrl}/philosophies`, config),
                    axios.get(`${baseUrl}/religions`, config),
                    axios.get(`${baseUrl}/astrological-systems`, config)
                ]);

                setData({
                    philosophies: philosophiesRes.data || [],
                    religions: religionsRes.data || [],
                    astrologicalSystems: astrologyRes.data || []
                });
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.detail || 'Failed to load data');
                setLoading(false);
            }
        };

        fetchData();
    }, [isLoggedIn]);
        // Also add logging to search function
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        try {
            const baseUrl = isLoggedIn ? 
                'http://localhost:5001/api/enhanced/search' : 
                'http://localhost:5001/api/search';
                
            const response = await axios.get(`${baseUrl}?query=${searchQuery}`, config);
            setData({
                philosophies: response.data.philosophies,
                religions: response.data.religions,
                astrologicalSystems: response.data.astrological_systems
            });
        } catch (err) {
            console.error('Search error:', err);
            setError(err.response?.data?.message || 'Search failed');
        }
    };

    return (
        <div className="container mt-4">
            {/* Enhanced title with badge for logged-in users */}
            <h1 className="text-center mb-4">
                Wisdom Traditions Database
                {isLoggedIn && <span className="badge bg-primary ms-2">Enhanced View</span>}
            </h1>
            
            {/* Search Bar with dynamic placeholder */}
            <div className="row mb-4">
                <div className="col-md-8 mx-auto">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder={isLoggedIn ? 
                                "Search with personalized results..." : 
                                "Search across all traditions..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button 
                            className="btn btn-primary"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
    
            {/* Navigation Tabs - keeping the same structure */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'philosophy' ? 'active' : ''}`}
                        onClick={() => setActiveTab('philosophy')}
                    >
                        Philosophy
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'religion' ? 'active' : ''}`}
                        onClick={() => setActiveTab('religion')}
                    >
                        Religion
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'astrology' ? 'active' : ''}`}
                        onClick={() => setActiveTab('astrology')}
                    >
                        Astrology
                    </button>
                </li>
            </ul>
    
            {/* Loading and Error States */}
            {loading && <div className="text-center">Loading...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
    
            {/* Content with enhanced props */}
            {!loading && !error && (
                <div className="row">
                    {activeTab === 'philosophy' && (
                        data.philosophies.map(philosophy => (
                            <div key={philosophy._id} className="col-md-6 mb-4">
                                <PhilosophyCard 
                                    philosophy={philosophy}
                                    isEnhanced={isLoggedIn}
                                />
                            </div>
                        ))
                    )}
                    
                    {activeTab === 'religion' && (
                        data.religions.map(religion => (
                            <div key={religion._id} className="col-md-6 mb-4">
                                <ReligionCard 
                                    religion={religion}
                                    isEnhanced={isLoggedIn}
                                />
                            </div>
                        ))
                    )}
                    
                    {activeTab === 'astrology' && (
                        data.astrologicalSystems.map(system => (
                            <div key={system._id} className="col-md-6 mb-4">
                                <AstrologyCard 
                                    system={system}
                                    isEnhanced={isLoggedIn}
                                />
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
export default KnowledgeBase;