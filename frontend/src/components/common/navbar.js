import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MoodMeetLogo from '../../assets/moodmeet.png';
import { FaHome, FaMap, FaCalendarAlt, FaUser } from 'react-icons/fa';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setIsLoggedIn(false); // This updates the state in the parent component
    localStorage.removeItem('isLoggedIn'); // This clears the login status from storage
    navigate('/');
  };

  const activeLinkClasses = "text-indigo-600 font-medium bg-gradient-to-br from-lilac-start to-lilac-end text-white px-4 py-2 rounded-full";
  const inactiveLinkClasses = "text-gray-600 hover:text-indigo-600 font-medium";
  
  const pathname = window.location.pathname;

  return (
    <nav className="fixed top-0 left-0 w-full p-4 bg-white shadow-md flex justify-between items-center z-50">
      <div className="flex items-center space-x-2">
        <img src={MoodMeetLogo} alt="MoodMeet Logo" className="h-20" />
      </div>
      <div className="flex items-center space-x-6">
        {isLoggedIn && (
          <>
            <Link to="/home" className={`${pathname === '/home' ? activeLinkClasses : inactiveLinkClasses} flex items-center space-x-2`}>
              <FaHome />
              <span>Home</span>
            </Link>
            <Link to="/map" className={`${pathname === '/map' ? activeLinkClasses : inactiveLinkClasses} flex items-center space-x-2`}>
              <FaMap />
              <span>Map</span>
            </Link>
            <Link to="/events" className={`${pathname === '/events' ? activeLinkClasses : inactiveLinkClasses} flex items-center space-x-2`}>
              <FaCalendarAlt />
              <span>My Events</span>
            </Link>
            <Link to="/profile" className={`${pathname === '/profile' ? activeLinkClasses : inactiveLinkClasses} flex items-center space-x-2`}>
              <FaUser />
              <span>Profile</span>
            </Link>
          </>
        )}
      </div>
      <div className="flex items-start space-x-4">
        {isLoggedIn ? (
          <button 
            onClick={handleLogoutClick}
            className="text-white bg-indigo-600 px-4 py-1.5 rounded-full hover:bg-indigo-700 transition"
          >
            Logout
          </button>
        ) : (
          <>
            <button 
              onClick={() => navigate('/', { state: { showForm: 'login' } })}
              className="text-indigo-600 border border-indigo-600 px-4 py-1.5 rounded-full hover:bg-indigo-50 transition"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/', { state: { showForm: 'register' } })}
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