import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import MyEventsPage from "./pages/MyEventsPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/QuizPage";
import Preferences from "./components/Preferences";
import Navbar from "./components/common/navbar";
import "./index.css";

const App = () => {
  // Global login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // store userId after login/registration

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <div className="pt-20">
        {" "}
        {/* prevent navbar overlap */}
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

          <Route path="/home" element={<HomePage />} />

          <Route path="/map" element={<MapPage />} />

          <Route path="/events" element={<MyEventsPage />} />

          <Route path="/profile" element={<ProfilePage userId={userId} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
