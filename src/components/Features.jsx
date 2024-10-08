import React from 'react';
import Card from './Card';
import SectionTitle from './SectionTitle'; // Import SectionTitle component

const Features = () => {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto py-16 px-4 md:px-8">
        {/* Use the SectionTitle component */}
        <SectionTitle text="Key Features" />
        
        {/* Use Flexbox for centering and wrapping */}
        <div className="flex flex-wrap justify-center gap-6">
          {/* Card Items */}
          <Card text="Provides robust, multi-level, and multi-dimensional metadata management" />
          <Card text="Integrates with NREL cloud and on-prem resources" />
          <Card text="Performs transforms for dataset handoffs" />
          <Card text="Enhances data accessibility and usability" />
          <Card text="Supports advanced analytics and reporting" />
          <Card text="Supports advanced analytics and reporting" />

        </div>
      </div>
    </div>
  );
};

export default Features;
