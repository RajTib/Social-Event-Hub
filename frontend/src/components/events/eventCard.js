import React from 'react';

const EventCard = ({ event, onInterestClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start space-y-4">
      <div className="flex items-center justify-between w-full">
        <span className={`px-3 py-1 text-sm rounded-full font-semibold ${
          event.category === 'Social' ? 'bg-indigo-100 text-indigo-800' :
          event.category === 'Wellness' ? 'bg-green-100 text-green-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          {event.category}
        </span>
        <span className="text-gray-500">{event.matchPercentage}% match</span>
        <button className="text-pink-500 hover:text-pink-700">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a.999.999 0 01-.707-.293l-6-6A6.999 6.999 0 013 7c0-3.866 3.134-7 7-7s7 3.134 7 7a6.999 6.999 0 01-2.293 4.707l-6 6a.999.999 0 01-.707.293zM10 2c-2.757 0-5 2.243-5 5a4.999 4.999 0 001.465 3.535L10 14.535l3.535-3.535A4.999 4.999 0 0015 7c0-2.757-2.243-5-5-5z"></path>
          </svg>
        </button>
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
      <div className="space-y-2 text-gray-600">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{event.time}</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span>{event.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12a4 4 0 100-8 4 4 0 000 8z"></path>
          </svg>
          <span>{event.peopleInterested} people interested</span>
        </div>
      </div>
      <p className="text-gray-600 mt-2">{event.description}</p>
      <button 
        onClick={() => onInterestClick(event)} 
        className="w-full bg-indigo-500 text-white font-semibold py-3 rounded-lg hover:bg-indigo-600 transition"
      >
        See Icebreakers!
      </button>
    </div>
  );
};

export default EventCard;