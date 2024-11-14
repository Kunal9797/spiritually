import React from 'react';
import { useNavigate } from 'react-router-dom';

function PhilosophyCard({ philosophy }) {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/tradition/philosophy/${philosophy.id}`);
    };
    
    return (
        <div 
            className="card h-100 shadow-sm" 
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="card-body">
                <h3 className="card-title">{philosophy.name}</h3>
                <p className="card-text">{philosophy.description}</p>
                <div className="mt-3">
                    <h6>Traditions:</h6>
                    <ul className="list-group list-group-flush">
                        {philosophy.traditions.map((tradition, index) => (
                            <li key={index} className="list-group-item">{tradition}</li>
                        ))}
                    </ul>
                    <h6 className="mt-3">Key Principles:</h6>
                    <ul className="list-group list-group-flush">
                        {philosophy.keyPrinciples.slice(0, 3).map((principle, index) => (
                            <li key={index} className="list-group-item">{principle}</li>
                        ))}
                    </ul>
                    {philosophy.keyPrinciples.length > 3 && (
                        <small className="text-muted mt-2">
                            And {philosophy.keyPrinciples.length - 3} more principles...
                        </small>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PhilosophyCard;