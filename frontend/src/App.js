import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import MyEventsPage from './pages/MyEventsPage';
import ProfilePage from './pages/ProfilePage';
import QuizPage from './pages/QuizPage';
import Navbar from './components/common/navbar';
import SplashScreen from './components/SplashScreen';
import './index.css';

const App = () => { 
  // Global login state 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user has visited this session
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (hasVisited) {
      // If they've already visited, skip the animation
      setIsLoading(false);
    } else {
      // If this is the first visit, show the animation
      const timer = setTimeout(() => {
        setIsLoading(false);
        // Set the flag so we don't show the animation again
        sessionStorage.setItem('hasVisited', 'true');
      }, 2000); // Animation duration (2 seconds)

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      {/* Navbar can optionally be added here if you want it visible on all pages */}
      {/* <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> */}
      <Routes>
        <Route 
          path="/" 
          element={<LandingPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/quiz" 
          element={<QuizPage />} 
        />
        <Route 
          path="/home" 
          element={<HomePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/map" 
          element={<MapPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/events" 
          element={<MyEventsPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/profile" 
          element={<ProfilePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
