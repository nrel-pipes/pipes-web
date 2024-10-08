import React from 'react';
import './PillButton.css'; // Assuming the CSS is in the same directory

const PillButton = ({ text, href }) => {
    return (
        <a
            href={href}
            className="pill-button"
        >
            {text}
        </a>
    );
};

export default PillButton;
