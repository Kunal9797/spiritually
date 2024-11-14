import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PhilosophyCard from './PhilosophyCard';
import ReligionCard from './ReligionCard';
import AstrologyCard from './AstrologyCard';

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

    useEffect(() => {
        const fetchData = async () => {
            console.log('Starting data fetch...');
            setLoading(true);
            setError(null);
            
            try {
                const [philosophiesRes, religionsRes, astrologyRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/philosophies'),
                    axios.get('http://localhost:5001/api/religions'),
                    axios.get('http://localhost:5001/api/astrological-systems')
                ]);

                console.log('Raw responses:', {
                    philosophies: philosophiesRes.data,
                    religions: religionsRes.data,
                    astrology: astrologyRes.data
                });

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
    }, []);
    // Also add logging to search function
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        console.log('Searching with query:', searchQuery); // Add this
        
        try {
            const response = await axios.get(`http://localhost:5001/api/search?query=${searchQuery}`);            console.log('Search results:', response.data); // Add this
            setData({
                philosophies: response.data.philosophies,
                religions: response.data.religions,
                astrologicalSystems: response.data.astrological_systems
            });
        } catch (err) {
            console.error('Search error:', err); // Add this
            setError('Search failed');
        }
    };
    console.log('Current state:', {
        loading,
        error,
        data,
        activeTab
    });

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Wisdom Traditions Database</h1>
            
            {/* Search Bar */}
            <div className="row mb-4">
                <div className="col-md-8 mx-auto">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search across all traditions..."
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

            {/* Navigation Tabs */}
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

            {/* Content */}
            <div className="row">
                {activeTab === 'philosophy' && (
                    data.philosophies.map(philosophy => (
                        <div key={philosophy._id} className="col-md-6 mb-4">
                            <PhilosophyCard philosophy={philosophy} />
                        </div>
                    ))
                )}
                
                {activeTab === 'religion' && (
                    data.religions.map(religion => (
                        <div key={religion._id} className="col-md-6 mb-4">
                            <ReligionCard religion={religion} />
                        </div>
                    ))
                )}
                
                {activeTab === 'astrology' && (
                    data.astrologicalSystems.map(system => (
                        <div key={system._id} className="col-md-6 mb-4">
                            <AstrologyCard system={system} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default KnowledgeBase;