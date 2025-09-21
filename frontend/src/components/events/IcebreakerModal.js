import React from 'react';

const IcebreakerModal = ({ eventTitle, conversationStarters, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">AI Conversation Starters</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p className="text-gray-500 mb-4">Perfect for breaking the ice at "{eventTitle}"</p>
        
        {conversationStarters.map((starter, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg mb-3">
            <p className="text-gray-700">{starter}</p>
          </div>
        ))}

        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
            Maybe Later
          </button>
          <button className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600 transition">
            Copy & Go!
          </button>
        </div>
      </div>
    </div>
  );
};

export default IcebreakerModal;