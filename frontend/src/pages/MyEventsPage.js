import React from 'react';
import Navbar from '../components/common/navbar';

const MyEventsPage = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold">My Events Page</h1>
        <p className="text-lg text-gray-600 mt-4">This is where you'll see all the events you're interested in.</p>
      </div>
    </div>
  );
};

export default MyEventsPage;