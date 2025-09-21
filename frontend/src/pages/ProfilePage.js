import React from 'react';
import Navbar from '../components/common/navbar';
import Footer from '../components/common/Footer';

const ProfilePage = ({ isLoggedIn }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="flex-grow container mx-auto p-8 pt-[7.5rem] text-center">
        <h1 className="text-4xl font-bold">Profile Page</h1>
        <p className="text-lg text-gray-600 mt-4">This is where you'll be able to view and edit your profile.</p>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;