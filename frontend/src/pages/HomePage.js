import React, { useState } from 'react';
import Navbar from '../components/common/navbar';
import EventCard from '../components/events/eventCard';
import IcebreakerModal from '../components/events/IcebreakerModal';
import Footer from '../components/common/Footer';

// Hardcoded data for events and icebreakers
const sampleEvents = [
  { id: 1, title: 'Board Game Night', category: 'Social', matchPercentage: 84, time: 'Friday, 7:00 PM', location: 'Community Center', peopleInterested: 28, description: 'Fun evening of board games, snacks, and making new friends.' },
  { id: 2, title: 'Sunset Yoga in the Park', category: 'Wellness', matchPercentage: 95, time: 'Today, 6:00 PM', location: 'Central Park, Main Lawn', peopleInterested: 24, description: 'Join us for a peaceful yoga session as the sun sets. Perfect for unwinding after a busy day.' },
  { id: 3, title: 'Watercolor Painting Class', category: 'Arts', matchPercentage: 91, time: 'Wednesday, 3:00 PM', location: 'Art Studio Downtown', peopleInterested: 16, description: 'Learn watercolor techniques in a relaxed, encouraging atmosphere.' },
];

const icebreakers = {
  'Sunset Yoga in the Park': [
    "How did you hear about this event? I found it through a friend who...",
    "I love the vibe here! What's your favorite way to meet new people?",
    "This is my first time at something like this - any tips for a newcomer?"
  ],
  'Board Game Night': [
    "Hey, what's a good game to start with tonight?",
    "Are there any pros here? I'm looking for a partner!",
    "This is my first time at a game night, so I'm a little nervous!"
  ],
  'Watercolor Painting Class': [
    "Are you an artist or just looking to try something new?",
    "What kind of art do you enjoy creating?",
    "Any tips for a beginner with watercolors?"
  ]
};

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleInterestClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={true} />
      <main className="flex-grow container mx-auto p-8 pt-20">
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
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer text-center">
              <span className="text-4xl mb-2">⚡</span>
              <h3 className="font-semibold text-lg">Energetic</h3>
              <p className="text-gray-500 text-sm">Ready for action!</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer text-center">
              <span className="text-4xl mb-2">☀️</span>
              <h3 className="font-semibold text-lg">Social</h3>
              <p className="text-gray-500 text-sm">Want to connect?</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer text-center">
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
            {sampleEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onInterestClick={handleInterestClick} 
              />
            ))}
          </div>
        </section>
      </main>

      {isModalOpen && selectedEvent && (
        <IcebreakerModal 
          eventTitle={selectedEvent.title}
          conversationStarters={icebreakers[selectedEvent.title] || []}
          onClose={handleCloseModal}
        />
      )}
      <Footer />
    </div>
  );
};

export default HomePage;