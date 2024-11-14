import React from 'react';

function Container({ children, className = '' }) {
    return (
        <div className={`container ${className}`}>
            <div className="content-wrapper">
                {children}
            </div>
        </div>
    );
}

export default Container;