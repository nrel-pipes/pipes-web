import React from 'react';
import FeatureCard from './cards/FeatureCard';
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
          <FeatureCard text="Provides robust, multi-level, and multi-dimensional metadata management" />
          <FeatureCard text="Integrates with NREL cloud and on-prem resources" />
          <FeatureCard text="Performs transforms for dataset handoffs" />
          <FeatureCard text="Enhances data accessibility and usability" />
          <FeatureCard text="Supports advanced analytics and reporting" />
          <FeatureCard text="Supports advanced analytics and reporting" />
        </div>
      </div>
    </div>
  );
};

export default Features;
