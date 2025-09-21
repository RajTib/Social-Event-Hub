import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/navbar';
import EventCard from '../components/events/eventCard';
import { getEvents } from '../api';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  
  useEffect(() => {
    fetchEvents(selectedMood);
  }, [selectedMood]);

  const fetchEvents = async (mood) => {
    const data = await getEvents(mood);
    setEvents(data);
  };

  const handleMoodClick = (mood) => {
    setSelectedMood(mood.toLowerCase());
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto p-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Welcome to MoodMeet</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover events that match your mood and connect with like-minded people in a welcoming, anxiety-free environment ✨
          </p>
        </section>

        {/* Mood Selection Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">How are you feeling today?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer text-center"
              onClick={() => handleMoodClick("energetic")}
            >
              <span className="text-4xl mb-2">⚡</span>
              <h3 className="font-semibold text-lg">Energetic</h3>
              <p className="text-gray-500 text-sm">Ready for action!</p>
            </div>
            <div 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer text-center"
              onClick={() => handleMoodClick("social")}
            >
              <span className="text-4xl mb-2">☀️</span>
              <h3 className="font-semibold text-lg">Social</h3>
              <p className="text-gray-500 text-sm">Want to connect?</p>
            </div>
            <div 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer text-center"
              onClick={() => handleMoodClick("calm")}
            >
              <span className="text-4xl mb-2">🌙</span>
              <h3 className="font-semibold text-lg">Calm</h3>
              <p className="text-gray-500 text-sm">Seeking peace</p>
            </div>
          </div>
        </section>

        {/* Event Feed Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Event Feed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length > 0 ? events.map(event => (
              <EventCard key={event.id} event={event} />
            )) : <p className="text-gray-500 col-span-3">No events for this mood yet.</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
