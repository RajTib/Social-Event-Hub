import React, { useEffect, useState } from "react";
import Navbar from "../components/common/navbar";
import Footer from "../components/common/Footer";

const MapPage = () => {
  const [mapHTML, setMapHTML] = useState("");

  // Pass a mood query param if you want: calm, energetic, anxious
  const mood = "calm";

  useEffect(() => {
    fetch(`http://localhost:5000/map?mood=${mood}`)
      .then((res) => res.text())
      .then((html) => setMapHTML(html))
      .catch(console.error);
  }, [mood]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={true} />
      <main className="flex-grow container mx-auto p-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Event Map</h1>
        {mapHTML ? (
          <div dangerouslySetInnerHTML={{ __html: mapHTML }} />
        ) : (
          <p>Loading map...</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MapPage;
