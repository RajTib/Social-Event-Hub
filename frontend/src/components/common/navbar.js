import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, onLoginClick, onRegisterClick }) => {
  return (
    <nav className="fixed top-0 left-0 w-full p-4 bg-white shadow-md flex justify-between items-center z-50">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold text-indigo-600">MoodMeet</span>
      </div>
      <div className="flex items-center space-x-6">
        {isLoggedIn && (
          <>
            <Link to="/home" className="text-gray-600 hover:text-indigo-600 font-medium">Home</Link>
            <Link to="/map" className="text-gray-600 hover:text-indigo-600 font-medium">Map</Link>
            <Link to="/events" className="text-gray-600 hover:text-indigo-600 font-medium">My Events</Link>
            <Link to="/profile" className="text-gray-600 hover:text-indigo-600 font-medium">Profile</Link>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <button 
            onClick={() => onLoginClick && onLoginClick()}
            className="text-white bg-indigo-600 px-4 py-1.5 rounded-full hover:bg-indigo-700 transition"
          >
            Logout
          </button>
        ) : (
          <>
            <button 
              onClick={onLoginClick}
              className="text-indigo-600 border border-indigo-600 px-4 py-1.5 rounded-full hover:bg-indigo-50 transition"
            >
              Login
            </button>
            <button 
              onClick={onRegisterClick}
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-full hover:bg-indigo-700 transition"
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;