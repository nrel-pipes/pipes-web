import React from 'react';
import './SectionTitle.css'; // Import the CSS styles for gradient lines

const SectionTitle = ({ text }) => {
  return (
    <div className="flex items-center justify-center mb-20">
      {/* Gradient line on the left */}
      <div className="gradient-line w-24 h-1 mr-4"></div>
      {/* Title text */}
      <h1 className="text-center text-5xl font-bold text-gray-800">{text}</h1>
      {/* Gradient line on the right */}
      <div className="gradient-line w-24 h-1 ml-4"></div>
    </div>
  );
};

export default SectionTitle;
