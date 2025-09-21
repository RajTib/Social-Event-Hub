import React from 'react';
import Navbar from '../components/common/navbar';

const ProfilePage = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold">Profile Page</h1>
        <p className="text-lg text-gray-600 mt-4">Your personal profile and settings will go here.</p>
      </div>
    </div>
  );
};

export default ProfilePage;