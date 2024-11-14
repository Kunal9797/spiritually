import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function TraditionPage() {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [tradition, setTradition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        const fetchTradition = async () => {
            try {
                let endpoint;
                switch(type) {
                    case 'philosophy':
                        endpoint = 'philosophies';
                        break;
                    case 'religion':
                        endpoint = 'religions';
                        break;
                    case 'astrology':
                        endpoint = 'astrological-systems';
                        break;
                    default:
                        throw new Error('Invalid tradition type');
                }
                
                console.log('Fetching from:', `http://localhost:5001/api/${endpoint}/${id}`);
                const response = await axios.get(`http://localhost:5001/api/${endpoint}/${id}`);
                console.log('Received data:', response.data);
                
                setTradition(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching tradition:', err);
                setError('Failed to load tradition details');
                setLoading(false);
            }
        };

        fetchTradition();
    }, [type, id]);

    const sendMessage = async () => {
        if (!chatMessage.trim()) return;
    
        // Add loading state to UI
        const userMessage = { role: 'user', content: chatMessage };
        setChatHistory(prev => [...prev, userMessage]);
        setChatMessage('');
    
        try {
            console.log('Sending message:', {
                type,
                id,
                message: chatMessage
            });
    
            const response = await axios.post(
                `http://localhost:5001/api/chat/${type}/${id}`,
                { message: chatMessage }  // Make sure this matches what backend expects
            );
    
            console.log('Received response:', response.data);
    
            // Add AI response to chat history
            setChatHistory(prev => [...prev, {
                role: 'assistant',
                content: response.data.content
            }]);
    
        } catch (err) {
            console.error('Chat error details:', err.response || err);
            setChatHistory(prev => [...prev, {
                role: 'error',
                content: `Error: ${err.response?.data?.error || 'Failed to get response. Please try again.'}`
            }]);
        }
    };
    if (loading) return <div className="container mt-5">Loading...</div>;
    if (error) return <div className="container mt-5 text-danger">{error}</div>;
    if (!tradition) return <div className="container mt-5">Tradition not found</div>;

    return (
        <div className="container mt-5">
            <button 
                className="btn btn-outline-primary mb-4"
                onClick={() => navigate('/knowledge-base')}
            >
                ← Back to Knowledge Base
            </button>

            <div className="row">
                {/* Tradition Details */}
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <h1 className="card-title">{tradition.name}</h1>
                            <p className="lead">{tradition.description}</p>

                            {tradition.traditions && (
                                <div className="mt-4">
                                    <h3>Traditions</h3>
                                    <ul className="list-group">
                                        {tradition.traditions.map((t, index) => (
                                            <li key={index} className="list-group-item">{t}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {tradition.keyPrinciples && (
                                <div className="mt-4">
                                    <h3>Key Principles</h3>
                                    <ul className="list-group">
                                        {tradition.keyPrinciples.map((principle, index) => (
                                            <li key={index} className="list-group-item">{principle}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {tradition.practices && (
                                <div className="mt-4">
                                    <h3>Practices</h3>
                                    <ul className="list-group">
                                        {tradition.practices.map((practice, index) => (
                                            <li key={index} className="list-group-item">{practice}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {tradition.elements && (
                                <div className="mt-4">
                                    <h3>Elements</h3>
                                    <ul className="list-group">
                                        {tradition.elements.map((element, index) => (
                                            <li key={index} className="list-group-item">{element}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-header">
                            <h3>Chat with {tradition.name} Guru</h3>
                        </div>
                        <div className="card-body">
                            <div className="chat-history mb-3" style={{height: '400px', overflowY: 'auto'}}>
                                {chatHistory.map((msg, index) => (
                                    <div key={index} className={`message ${msg.role}`}>
                                        <p className={msg.role === 'user' ? 'text-end' : ''}>
                                            {msg.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    placeholder="Ask your question..."
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <button 
                                    className="btn btn-primary"
                                    onClick={sendMessage}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TraditionPage;