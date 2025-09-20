import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";

export default function App() {
  const [mood, setMood] = useState("calm");
  const [events, setEvents] = useState([]);
  const [icebreaker, setIcebreaker] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/events?mood=${mood}`)
      .then(r => r.json())
      .then(setEvents)
      .catch(console.error);
  }, [mood]);

  async function handleInterested(ev) {
    try {
      await fetch(`${API_BASE}/api/interested`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: ev.id, user_id: "raj_demo" })
      });
      const res = await fetch(`${API_BASE}/api/icebreaker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interest: ev.category })
      });
      const data = await res.json();
      setIcebreaker({ text: data.icebreaker, event: ev.title });
      // refresh events to show updated popularity
      const refreshed = await fetch(`${API_BASE}/api/events?mood=${mood}`).then(r => r.json());
      setEvents(refreshed);
    } catch (e) { console.error(e); }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1>AI Social Hub — DevJams MVP</h1>
      <p>Select mood → see events → tap "I'm Interested" → get an icebreaker ✨</p>

      <label>
        Mood:
        <select value={mood} onChange={(e) => setMood(e.target.value)} style={{ marginLeft: 8 }}>
          <option value="calm">Calm</option>
          <option value="energetic">Energetic</option>
          <option value="anxious">Anxious</option>
        </select>
      </label>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginTop: 18 }}>
        {events.map(ev => (
          <div key={ev.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
            <h3>{ev.title}</h3>
            <p style={{ margin: "6px 0" }}>{ev.category} • popularity: {ev.popularity}</p>
            <button onClick={() => handleInterested(ev)}>I'm Interested</button>
          </div>
        ))}
      </div>

      {icebreaker && (
        <div style={{ marginTop: 20, padding: 12, border: "1px solid #4a90e2", borderRadius: 8, background: "#f5fbff" }}>
          <h4>Icebreaker for: {icebreaker.event}</h4>
          <pre style={{ whiteSpace: "pre-wrap" }}>{icebreaker.text}</pre>
        </div>
      )}

      <div style={{ marginTop: 26 }}>
        <a href={`${API_BASE}/map`} target="_blank" rel="noreferrer">Open event map (folium)</a>
      </div>
    </div>
  );
}
