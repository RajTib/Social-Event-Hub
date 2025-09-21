import React, { useState } from "react";
import { markInterested, getIcebreaker } from "../../../src/api"; // adjust path to your api.js

const EventCard = ({ event }) => {
  const [peopleInterested, setPeopleInterested] = useState(event.popularity || 0);
  const [icebreakerText, setIcebreakerText] = useState("");
  const [isInterested, setIsInterested] = useState(false);

  const handleInterestClick = async () => {
    try {
      if (!isInterested) {
        // Mark user interested in backend
        await markInterested(event.id, "anon"); // replace "anon" with actual user ID if available
        setPeopleInterested(prev => prev + 1);
        setIsInterested(true);
      }

      // Fetch icebreakers
      const icebreakers = await getIcebreaker(event.category || "something cool");
      setIcebreakerText(icebreakers);
    } catch (err) {
      console.error("Error marking interest or fetching icebreaker:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start space-y-4 hover:shadow-lg transition">
      <div className="flex items-center justify-between w-full">
        <span className={`px-3 py-1 text-sm rounded-full font-semibold ${
          event.category === 'art' ? 'bg-indigo-100 text-indigo-800' :
          event.category === 'music' ? 'bg-green-100 text-green-800' :
          event.category === 'meetup' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {event.category}
        </span>
        <span className="text-gray-500">{event.matchPercentage || Math.floor(Math.random() * 100)}% match</span>
      </div>

      <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>

      <div className="space-y-2 text-gray-600">
        <div>Time: {event.time || "TBA"}</div>
        <div>Location: {event.location || "Nearby"}</div>
        <div>{peopleInterested} people interested</div>
      </div>

      <p className="text-gray-600 mt-2">{event.description || "No description available"}</p>

      <button 
        onClick={handleInterestClick} 
        className="w-full bg-indigo-500 text-white font-semibold py-3 rounded-lg hover:bg-indigo-600 transition"
      >
        {isInterested ? "See Icebreakers" : "I'm Interested"}
      </button>

      {icebreakerText && (
        <div className="mt-2 p-3 bg-yellow-100 rounded">
          <h4 className="font-semibold mb-1">Icebreakers:</h4>
          <pre className="whitespace-pre-wrap">{icebreakerText}</pre>
        </div>
      )}
    </div>
  );
};

export default EventCard;
