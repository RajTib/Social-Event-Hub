import axios from "axios";

const API_BASE = "http://127.0.0.1:5000"; // Flask backend URL

export const getEvents = async (mood = "") => {
    const url = mood ? `${API_BASE}/api/events?mood=${mood}` : `${API_BASE}/api/events`;
    const res = await axios.get(url);
    return res.data;
};

export const markInterested = async (eventId, userId = "anon") => {
    const res = await axios.post(`${API_BASE}/api/interested`, { event_id: eventId, user_id: userId });
    return res.data;
};

export const getIcebreaker = async (interest = "something cool") => {
    const res = await axios.post(`${API_BASE}/api/icebreaker`, { interest });
    return res.data.icebreaker;
};
