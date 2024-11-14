import React from 'react';
import { useNavigate } from 'react-router-dom';

function ReligionCard({ religion }) {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/tradition/religion/${religion.id}`);
    };

    return (
        <div 
            className="card h-100 shadow-sm"
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="card-body">
                <h3 className="card-title">{religion.name}</h3>
                <p className="card-text">{religion.description}</p>
                <div className="mt-3">
                    <h6>Practices:</h6>
                    <ul className="list-group list-group-flush">
                        {religion.practices.map((practice, index) => (
                            <li key={index} className="list-group-item">{practice}</li>
                        ))}
                    </ul>
                    <h6 className="mt-3">Key Beliefs:</h6>
                    <ul className="list-group list-group-flush">
                        {religion.keyBeliefs.map((belief, index) => (
                            <li key={index} className="list-group-item">{belief}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ReligionCard;