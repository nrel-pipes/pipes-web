import React from 'react';
import PillButton from './PillButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEdit } from '@fortawesome/free-solid-svg-icons';

const Breadcrumb = ({ directory }) => {
  // Ensure directory is an array; if not, make it an empty array
  const items = Array.isArray(directory) ? directory : [];

  return (
    <div className='my-4'>

    <nav className="px-5 py-3 text-gray-700 rounded-lg bg-white" aria-label="Breadcrumb">
      <div className="flex justify-between items-center">
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-3 h-3 mx-2 text-gray-400 flex-shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              )}
              <PillButton
                text={
                  <>
                    {index === 0 && (
                      <FontAwesomeIcon icon={faHome} className="mr-2 h-4 w-4" />
                    )}
                    {item}
                  </>
                }
                href="#"
                className="h-9 flex items-center" // Set a consistent height and alignment
              />
            </li>
          ))}
        </ol>
        <div className="ml-4 flex-shrink-0">
          <PillButton
            text={
              <>
                <FontAwesomeIcon icon={faEdit} className="mr-2 h-4 w-4" />
                Edit
              </>
            }
            href="#"
            className="h-9 flex items-center" // Same height and alignment for "Edit" button
          />
        </div>
      </div>
    </nav>
    </div>
  );
};

export default Breadcrumb;
