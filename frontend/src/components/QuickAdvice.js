import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

function QuickAdvice() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        birth_date: '',
        birth_time: '',
        location: ''
    });
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post('http://localhost:8000/api/quick-advice', formData);
            if (response.data && response.data.advice) {
                setAdvice(response.data.advice);
            } else {
                setError('No advice received from server');
            }
        } catch (err) {
            console.error('Error details:', err);
            setError(err.response?.data?.detail || 'Failed to get advice. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Get Quick Advice</h2>
                            
                            {error && <div className="alert alert-danger">{error}</div>}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Birth Date:</label>
                                    <input
                                        type="date"
                                        name="birth_date"
                                        className="form-control"
                                        value={formData.birth_date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Birth Time (optional):</label>
                                    <input
                                        type="time"
                                        name="birth_time"
                                        className="form-control"
                                        value={formData.birth_time}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Location:</label>
                                    <input
                                        type="text"
                                        name="location"
                                        className="form-control"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="d-grid gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Getting Advice...' : 'Get Advice'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate('/')}
                                    >
                                        Back to Home
                                    </button>
                                </div>
                            </form>
                            
                            {advice && (
                                <div className="mt-4">
                                    <h4>Your Reading:</h4>
                                    <div className="card">
                                        <div className="card-body">
                                            {advice}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuickAdvice;