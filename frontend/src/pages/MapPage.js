import React from 'react';
import Navbar from '../components/common/navbar';

const MapPage = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold">Map Page</h1>
        <p className="text-lg text-gray-600 mt-4">Coming soon: A map to find events near you!</p>
      </div>
    </div>
  );
};

export default MapPage;