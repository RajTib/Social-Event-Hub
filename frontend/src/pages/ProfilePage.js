// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/common/navbar";
import Footer from "../components/common/Footer";

const ProfilePage = ({ userId, isLoggedIn, setIsLoggedIn }) => {
  const [user, setUser] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Fetch profile on load
  const fetchProfile = async () => {
    const res = await fetch(`http://localhost:5000/api/user/${userId}`);
    const data = await res.json();
    setUser(data);
    setProfileImage(data.profile_image || null);
    setLat(data.lat || null);
    setLon(data.lon || null);
  };

  useEffect(() => {
    fetchProfile();

    // Auto-geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        },
        (err) => console.log("Location denied", err)
      );
    }
  }, [userId]);

  const handleUpdate = async () => {
    setUpdating(true);
    await fetch("http://localhost:5000/api/user/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        name: user.name,
        age: user.age,
        gender: user.gender,
        lat,
        lon,
      }),
    });
    await fetchProfile(); // refresh to show updated data
    setUpdating(false);
    alert("Profile updated ✅");
  };

  const handleImageUpload = async (e) => {
    const formData = new FormData();
    formData.append("profile_image", e.target.files[0]);
    formData.append("user_id", userId);

    const res = await fetch("http://localhost:5000/api/profile/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.status === "success") {
      setProfileImage(data.profile_image);
      alert("Profile picture updated ✅");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <div className="flex-grow bg-gradient-to-b from-purple-100 via-pink-100 to-yellow-100 flex justify-center items-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Your Profile
          </h1>

          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-3">
              {profileImage ? (
                <img
                  src={`http://localhost:5000/${profileImage}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="flex justify-center items-center h-full text-gray-500">
                  No Image
                </span>
              )}
            </div>
            <input
              type="file"
              onChange={handleImageUpload}
              className="text-sm text-gray-600"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Name</label>
            <input
              type="text"
              value={user.name || ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Age</label>
            <input
              type="number"
              min={14}
              max={100}
              value={user.age || ""}
              onChange={(e) => setUser({ ...user, age: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Gender</label>
            <select
              value={user.gender || ""}
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            disabled={updating}
            className="w-full bg-purple-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-purple-600 transition"
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
