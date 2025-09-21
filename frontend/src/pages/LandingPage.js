import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/common/navbar';
import Footer from '../components/common/Footer';
import LoginForm from '../components/common/LoginForm';
import RegisterForm from '../components/common/RegisterForm';

const LandingPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showForm, setShowForm] = useState(null);

  // Show form based on navigation state
  useEffect(() => {
    if (location.state && location.state.showForm) {
      setShowForm(location.state.showForm);
    }
  }, [location.state]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate('/home');
  };

  const handleRegisterSuccess = () => {
    setIsLoggedIn(true);
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={false} setIsLoggedIn={setIsLoggedIn} />
      
      <main className="flex-grow container mx-auto p-8 flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight">
            Connect with your mood, not just people.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            MoodMeet helps you discover events and groups based on how you feel. Whether you're feeling energetic, social, or calm, find your perfect vibe and meet people who get it.
          </p>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center">
          {showForm === 'login' ? (
            <LoginForm 
              onLogin={handleLoginSuccess}
              onSwitchToRegister={() => setShowForm('register')}
            />
          ) : showForm === 'register' ? (
            <RegisterForm 
              onRegister={handleRegisterSuccess}
              onSwitchToLogin={() => setShowForm('login')}
            />
          ) : (
            <div className="p-8 bg-white rounded-lg shadow-xl text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ready to find your tribe?</h2>
              <p className="text-gray-600 mb-6">Join MoodMeet today and start your journey to better connections.</p>
              <button 
                onClick={() => setShowForm('register')}
                className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-indigo-700 transition"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
