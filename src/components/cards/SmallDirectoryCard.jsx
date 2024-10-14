import React from 'react';

const SmallDirectoryCard = () => {
  return (
    <div className="flex items-center w-[289.66px] h-12 rounded border border-[#DEE2E5] bg-gray100 hover:bg-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center w-full h-full pl-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500 mr-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
        <span className="text-gray-700 font-medium">backup</span>
      </div>
    </div>
  );
};

export default SmallDirectoryCard;
