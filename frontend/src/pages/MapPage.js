// frontend/src/pages/MapPage.js
import React, { useState } from "react";
import Navbar from "../components/common/navbar";
import Footer from "../components/common/Footer";

const MapPage = () => {
  const [mood, setMood] = useState("all");

  // Build the URL dynamically depending on mood
  const mapUrl =
    mood === "all"
      ? "http://localhost:5000/map"
      : `http://localhost:5000/map?mood=${mood}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={true} />

      <main className="flex-grow container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold">Event Map</h1>
        <p className="text-lg text-gray-600 mt-4">
          Explore events near you! Select a mood to filter the events.
        </p>

        {/* Mood Filter */}
        <div className="my-6">
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="all">All Events</option>
            <option value="calm">Calm</option>
            <option value="energetic">Energetic</option>
            <option value="anxious">Anxious</option>
          </select>
        </div>

        {/* Embed Folium map */}
        <div className="w-full h-[600px] border rounded-lg overflow-hidden shadow-lg">
          <iframe
            key={mapUrl} // re-render when mood changes
            src={mapUrl}
            title="Events Map"
            className="w-full h-full"
            frameBorder="0"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MapPage;
