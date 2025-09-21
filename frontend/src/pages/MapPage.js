import React from 'react';
import Navbar from '../components/common/navbar';
import Footer from '../components/common/Footer';

const MapPage = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Pass isLoggedIn and setIsLoggedIn to Navbar */}
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <main className="flex-grow container mx-auto p-8 pt-[7.5rem] text-center">
        <h1 className="text-4xl font-bold mb-6">Map Page</h1>
        <p className="text-lg text-gray-600 mb-6">Find events near you on the interactive map!</p>

        {/* Embedded Folium map via iframe */}
        <div className="w-full h-[600px] border rounded-lg overflow-hidden shadow-md">
          <iframe
            src="http://localhost:5000/map" // Flask backend map URL
            title="Event Map"
            width="100%"
            height="100%"
            style={{ border: '0' }}
          ></iframe>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MapPage;
