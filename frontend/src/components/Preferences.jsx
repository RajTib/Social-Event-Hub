// src/components/Preferences.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Preferences({ userId, onFinish }) {
  const [answers, setAnswers] = useState({
    music: [],
    movies: [],
    books: [],
    food: []
  });
  const [step, setStep] = useState("music");
  const navigate = useNavigate();

  const options = {
    music: ["Pop", "Rock", "Hip-Hop", "Jazz", "Classical", "Indie", "EDM"],
    movies: ["Action", "Romance", "Sci-Fi", "Comedy", "Drama", "Horror"],
    books: ["Fiction", "Non-Fiction", "Fantasy", "Mystery", "Poetry", "Philosophy"],
    food: ["Italian", "Indian", "Mexican", "Japanese", "Chinese", "Mediterranean"]
  };

  const toggleAnswer = (category, choice) => {
    setAnswers(prev => {
      const already = prev[category].includes(choice);
      return {
        ...prev,
        [category]: already
          ? prev[category].filter(c => c !== choice)
          : [...prev[category], choice]
      };
    });
  };

  const handleNext = () => {
    if (step === "music") setStep("movies");
    else if (step === "movies") setStep("books");
    else if (step === "books") setStep("food");
    else setStep("done");
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, ...answers })
      });
      const data = await res.json();
      if (data.status === "success") {
        onFinish();
        navigate("/home");
      }
    } catch (err) {
      console.error("Error saving preferences:", err);
    }
  };

  if (step === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-200 via-pink-200 to-yellow-100">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            You’re all set! 🎉
          </h2>
          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-600 transition"
          >
            I’m Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-200 via-pink-200 to-yellow-100">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {step === "music" && "Pick Your Favorite Music Genres 🎵"}
          {step === "movies" && "Pick Your Favorite Movie Genres 🎬"}
          {step === "books" && "Pick Your Favorite Book Types 📚"}
          {step === "food" && "Pick Your Favorite Cuisines 🍕"}
        </h2>

        <div className="space-y-4">
          {options[step].map(opt => (
            <label
              key={opt}
              className={`flex items-center p-3 border rounded-xl cursor-pointer transition ${
                answers[step].includes(opt)
                  ? "bg-purple-500 text-white border-purple-500"
                  : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={answers[step].includes(opt)}
                onChange={() => toggleAnswer(step, opt)}
                className="mr-3 w-5 h-5 accent-purple-500"
              />
              {opt}
            </label>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="mt-6 w-full bg-purple-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-purple-600 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
