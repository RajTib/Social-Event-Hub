import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import MyEventsPage from "./pages/MyEventsPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/QuizPage";
import Preferences from "./components/Preferences";
import Navbar from "./components/common/navbar";
import SplashScreen from "./components/SplashScreen";
import "./index.css";

const App = () => {
  // Global login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // store userId after login/registration
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user has visited this session
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (hasVisited) {
      setIsLoading(false); // Skip splash if already visited
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("hasVisited", "true");
      }, 2000); // 2 seconds splash

      return () => clearTimeout(timer);
    }
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <div className="pt-20">
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                setIsLoggedIn={setIsLoggedIn}
                setUserId={setUserId}
              />
            }
          />

          <Route path="/quiz" element={<QuizPage userId={userId} />} />

          <Route
            path="/preferences"
            element={
              <Preferences
                userId={userId}
                onFinish={() => {
                  setIsLoggedIn(true);
                  window.location.href = "/home"; // redirect after saving
                }}
              />
            }
          />

          <Route path="/home" element={<HomePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />

          <Route path="/map" element={<MapPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />

          <Route path="/events" element={<MyEventsPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />

          <Route path="/profile" element={<ProfilePage userId={userId} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
