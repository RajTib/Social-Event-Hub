import React, { useState } from 'react';

const EventCard = ({ event, onInterestClick }) => {
  const [isInterested, setIsInterested] = useState(false);

  const handleButtonClick = () => {
    if (!isInterested) {
      // First click: Change the button text
      setIsInterested(true);
    } else {
      // Second click: Open the modal
      onInterestClick(event);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
          <span className="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">{event.matchPercentage}% Match</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm space-x-2 mb-4">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 13a1 1 0 112 0v1a1 1 0 11-2 0v-1zM10 5a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
            {event.time}
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 20a10 10 0 110-20 10 10 0 010 20zm0-18a8 8 0 100 16 8 8 0 000-16zM9 10a1 1 0 00-1 1v4a1 1 0 002 0v-4a1 1 0 00-1-1z"></path>
              <path d="M10 9a1 1 0 00-1 1v4a1 1 0 002 0v-4a1 1 0 00-1-1z"></path>
            </svg>
            {event.location}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{event.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">{event.peopleInterested} interested</span>
          <button 
            onClick={handleButtonClick}
            className="text-white bg-indigo-600 px-4 py-2 rounded-full font-semibold hover:bg-indigo-700 transition"
          >
            {isInterested ? "See Icebreakers" : "I'm Interested"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;