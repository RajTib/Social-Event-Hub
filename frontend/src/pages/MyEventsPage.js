import React from 'react';
import Navbar from '../components/common/navbar';
import Footer from '../components/common/Footer';

const MyEventsPage = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="flex-grow container mx-auto p-8 pt-[7.5rem] text-center">
        <h1 className="text-4xl font-bold">My Events Page</h1>
        <p className="text-lg text-gray-600 mt-4">This is where you'll see all the events you're interested in.</p>
      </main>
      <Footer />
    </div>
  );
};

export default MyEventsPage;