// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";

const ProfilePage = ({ userId }) => {
  const [user, setUser] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  useEffect(() => {
    // fetch profile
    fetch(`http://localhost:5000/api/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLat(data.lat);
        setLon(data.lon);
      });

    // auto location
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
    await fetch("http://localhost:5000/api/user/update", {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        user_id: userId,
        name: user.name,
        age: user.age,
        gender: user.gender,
        lat,
        lon
      })
    });
    alert("Profile updated!");
  };

  const handleImageUpload = async (e) => {
    const formData = new FormData();
    formData.append("profile_image", e.target.files[0]);
    formData.append("user_id", userId);

    const res = await fetch("http://localhost:5000/api/profile/upload", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    if (data.status === "success") {
      setProfileImage(data.profile_image);
      alert("Profile image updated!");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="mb-4">
        <label>Name</label>
        <input type="text" value={user.name || ""} onChange={(e) => setUser({...user, name: e.target.value})} />
      </div>

      <div className="mb-4">
        <label>Age</label>
        <input type="number" value={user.age || ""} onChange={(e) => setUser({...user, age: e.target.value})} />
      </div>

      <div className="mb-4">
        <label>Gender</label>
        <select value={user.gender || ""} onChange={(e) => setUser({...user, gender: e.target.value})}>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label>Profile Image</label>
        <input type="file" onChange={handleImageUpload} />
        {profileImage && <img src={`http://localhost:5000/${profileImage}`} alt="profile" className="w-32 h-32 rounded-full mt-2" />}
      </div>

      <button onClick={handleUpdate} className="bg-indigo-600 text-white px-4 py-2 rounded">Update Profile</button>
    </div>
  );
};

export default ProfilePage;
