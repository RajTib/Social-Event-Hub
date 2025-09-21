import axios from "axios";

const API_BASE = "http://127.0.0.1:5000"; // Flask backend URL

// frontend/src/api.js
export const getEvents = async (mood = "") => {
  try {
    let url = "http://localhost:5000/api/events";
    if (mood) {
      url += `?mood=${encodeURIComponent(mood)}`;
    }
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch events");
    }
    const data = await res.json();
    return data; // array of events
  } catch (err) {
    console.error("Error fetching events:", err);
    return [];
  }
};


export const markInterested = async (eventId, userId = "anon") => {
    const res = await axios.post(`${API_BASE}/api/interested`, { event_id: eventId, user_id: userId });
    return res.data;
};

export const getIcebreaker = async (interest = "something cool") => {
    const res = await axios.post(`${API_BASE}/api/icebreaker`, { interest });
    return res.data.icebreaker;
};
