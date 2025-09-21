import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/navbar';
import EventCard from '../components/events/eventCard';
import IcebreakerModal from '../components/events/IcebreakerModal';
import Footer from '../components/common/Footer';
import { getEvents } from '../api'; // your backend API

const moods = [
  { emoji: "⚡", label: "Energetic", description: "Ready for action!" },
  { emoji: "☀️", label: "Social", description: "Want to connect?" },
  { emoji: "🌙", label: "Calm", description: "Seeking peace" },
];

const HomePage = ({ isLoggedIn, setIsLoggedIn }) => {
  const [events, setEvents] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch events when mood changes
  // inside HomePage component
useEffect(() => {
  const fetchEvents = async () => {
    try {
      const data = await getEvents(selectedMood.toLowerCase());
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]); // empty array if error
    }
  };

  // Fetch events if user is logged in and a mood is selected
  if (isLoggedIn) {
    fetchEvents();
  }
}, [selectedMood, isLoggedIn]);


  const handleMoodClick = (mood) => setSelectedMood(mood);

  const handleInterestClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar with global login/logout state */}
      <Navbar 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
      />

      {isLoggedIn ? (
        <main className="flex-grow container mx-auto p-8 pt-[7.5rem]">
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
              {moods.map((m) => (
                <div 
                  key={m.label}
                  onClick={() => handleMoodClick(m.label)}
                  className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer text-center ${
                    selectedMood === m.label ? "border-2 border-indigo-500" : ""
                  }`}
                >
                  <span className="text-4xl mb-2">{m.emoji}</span>
                  <h3 className="font-semibold text-lg">{m.label}</h3>
                  <p className="text-gray-500 text-sm">{m.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Event Feed Section */}
          <section>
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Event Feed</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {events.length > 0 ? (
      events.map(event => (
        <EventCard 
          key={event.id} 
          event={event} 
          onInterestClick={() => handleInterestClick(event)} 
        />
      ))
    ) : (
      <p className="text-gray-500 col-span-3">
        {selectedMood ? `No events for "${selectedMood}" yet.` : "No events available."}
      </p>
    )}
  </div>
</section>

        </main>
      ) : (
        <div className="flex-grow flex items-center justify-center p-8 pt-20">
          <p className="text-xl text-gray-700">Please log in to see events.</p>
        </div>
      )}

      {/* Icebreaker Modal */}
      {isModalOpen && selectedEvent && (
        <IcebreakerModal 
          eventTitle={selectedEvent.title}
          interest={selectedEvent.category}
          onClose={handleCloseModal}
        />
      )}

      <Footer />
    </div>
  );
};

export default HomePage;
