import React from 'react';
import MoodMeetLogo from '../../assets/moodmeet.png'; // Corrected path

const SplashScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <img
        src={MoodMeetLogo}
        alt="MoodMeet Logo"
        className="h-40 w-40 animate-pulse-fast"
      />
    </div>
  );
};

export default SplashScreen;