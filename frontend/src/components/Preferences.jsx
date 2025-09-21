import { useState } from "react";

export default function Preferences({ userId, onFinish }) {
  const [selected, setSelected] = useState([]);
  const categories = ["Concerts", "Art", "Volunteering", "Gaming", "Workshops"];

  const toggleCategory = (cat) => {
    setSelected(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, categories: selected })
      });
      const data = await res.json();
      if (data.status === "success"){
        onFinish();
      } 
    } catch (err) {
      console.error("Error saving preferences:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-200 via-pink-200 to-yellow-100">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Choose Your Event Preferences
        </h2>
        <div className="space-y-4">
          {categories.map(cat => (
            <label
              key={cat}
              className={`flex items-center p-3 border rounded-xl cursor-pointer transition ${
                selected.includes(cat)
                  ? "bg-purple-500 text-white border-purple-500"
                  : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="mr-3 w-5 h-5 accent-purple-500"
              />
              {cat}
            </label>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-purple-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-purple-600 transition"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
