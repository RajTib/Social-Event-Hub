import React from 'react';
import MoodMeetLogo from '../assets/moodmeet.png';

const SplashScreen = () => {
  return (
    <div className="splash-screen fixed inset-0 flex flex-col items-center justify-center bg-white z-50 transition-opacity duration-1000 ease-in-out">
      <div className="logo-container animate-fade-in-up">
        <img src={MoodMeetLogo} alt="MoodMeet Logo" className="w-48 md:w-64" />
      </div>
      <p className="mt-4 text-xl md:text-2xl text-gray-700 animate-fade-in-up delay-200">
        Finding your vibe...
      </p>
    </div>
  );
};

export default SplashScreen;