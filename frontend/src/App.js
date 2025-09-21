import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import MyEventsPage from './pages/MyEventsPage';
import ProfilePage from './pages/ProfilePage';
import QuizPage from './pages/QuizPage';
import Navbar from './components/common/navbar';
import './index.css';

const App = () => { 
  // Global login state 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
 
  return (
    <Router>
      {/* Navbar always receives global login state */}
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <Routes>
        <Route 
          path="/" 
          element={<LandingPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/quiz" 
          element={<QuizPage />}  // Added quiz route
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
