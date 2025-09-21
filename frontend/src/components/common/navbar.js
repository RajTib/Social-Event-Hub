import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initial state is false

  const handleLoginClick = () => {
    setIsLoggedIn(true);
  };

  const handleLogoutClick = () => {
    setIsLoggedIn(false);
  };

  return (
    <nav className="p-4 bg-white shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold text-indigo-600">MoodMeet</span>
      </div>
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium">Home</Link>
        <Link to="/map" className="text-gray-600 hover:text-indigo-600 font-medium">Map</Link>
        <Link to="/events" className="text-gray-600 hover:text-indigo-600 font-medium">My Events</Link>
        <Link to="/profile" className="text-gray-600 hover:text-indigo-600 font-medium">Profile</Link>
      </div>
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <button 
            onClick={handleLogoutClick}
            className="text-white bg-indigo-600 px-4 py-1.5 rounded-full hover:bg-indigo-700 transition"
          >
            Logout
          </button>
        ) : (
          <button 
            onClick={handleLoginClick}
            className="text-white bg-indigo-600 px-4 py-1.5 rounded-full hover:bg-indigo-700 transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;