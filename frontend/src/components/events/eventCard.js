import React, { useState } from "react";

const EventCard = ({ event }) => {
  const [peopleInterested, setPeopleInterested] = useState(event.popularity || 0);
  const [icebreakers, setIcebreakers] = useState([]);
  const [isInterested, setIsInterested] = useState(false);
  const [showIcebreakers, setShowIcebreakers] = useState(false);

  const handleInterestClick = async () => {
    try {
      if (!isInterested) {
        // Mark interest in backend
        await fetch("/api/interested", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event_id: event.id, user_id: "anon" }) // replace "anon" with actual user ID
        });
        setPeopleInterested(prev => prev + 1);
        setIsInterested(true);
      }

      // Fetch ALL icebreakers from backend
      const res = await fetch("http://localhost:5000/api/icebreakers/all");
      const data = await res.json();
      setIcebreakers(data.icebreakers || []);
      setShowIcebreakers(true);

    } catch (err) {
      console.error("Error fetching icebreakers:", err);
      setIcebreakers([]);
      setShowIcebreakers(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start space-y-4 hover:shadow-lg transition">
      <div className="flex items-center justify-between w-full">
        <span className={`px-3 py-1 text-sm rounded-full font-semibold ${
          event.category === 'art' ? 'bg-indigo-100 text-indigo-800' :
          event.category === 'music' ? 'bg-green-100 text-green-800' :
          event.category === 'meetup' ? 'bg-purple-100 text-purple-800' :
          event.category === 'workshop' ? 'bg-yellow-100 text-yellow-800' :
          event.category === 'date' ? 'bg-pink-100 text-pink-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {event.category || "general"}
        </span>
        <span className="text-gray-500">{event.matchPercentage || Math.floor(Math.random() * 100)}% match</span>
      </div>

      <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>

      <div className="space-y-2 text-gray-600">
        <div><strong>Time:</strong> {event.event_time || "TBA"}</div>
        <div><strong>Location:</strong> {event.location_name || "Nearby"}</div>
        <div><strong>Interested:</strong> {peopleInterested} people</div>
      </div>

      <p className="text-gray-600 mt-2">{event.description || "No description available"}</p>

      <button 
        onClick={handleInterestClick} 
        className="w-full bg-indigo-500 text-white font-semibold py-3 rounded-lg hover:bg-indigo-600 transition"
      >
        {isInterested ? "See Icebreakers" : "I'm Interested"}
      </button>

      {showIcebreakers && icebreakers.length > 0 && (
        <div className="mt-2 p-3 bg-yellow-100 rounded">
          <h4 className="font-semibold mb-1">Icebreakers:</h4>
          <ul className="list-disc pl-5">
            {icebreakers.map((ib, idx) => (
              <li key={idx}>{ib}</li>
            ))}
          </ul>
        </div>
      )}

      {showIcebreakers && icebreakers.length === 0 && (
        <div className="mt-2 p-3 bg-yellow-100 rounded text-gray-600">
          No icebreakers available.
        </div>
      )}
    </div>
  );
};

export default EventCard;
