import React from 'react';
import { useNavigate } from 'react-router-dom';

function AstrologyCard({ system }) {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/tradition/astrology/${system._id}`);
    };

    return (
        <div 
            className="card h-100 shadow-sm"
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="card-body">
                <h3 className="card-title">{system.name}</h3>
                <p className="card-text">{system.description}</p>
                <div className="mt-3">
                    <h6>Elements:</h6>
                    <ul className="list-group list-group-flush">
                        {system.elements.map((element, index) => (
                            <li key={index} className="list-group-item">{element}</li>
                        ))}
                    </ul>
                    <h6 className="mt-3">Key Principles:</h6>
                    <ul className="list-group list-group-flush">
                        {system.keyPrinciples.map((principle, index) => (
                            <li key={index} className="list-group-item">{principle}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AstrologyCard;