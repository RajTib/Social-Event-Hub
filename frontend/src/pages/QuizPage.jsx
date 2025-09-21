// src/pages/QuizPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Preferences from "../components/Preferences"; // adjust path if needed

const QuizPage = () => {
  const navigate = useNavigate();

  // Suppose you have a logged-in user object somewhere
  const userId = "some-user-id"; // replace with actual user ID from context/state

  return (
    <Preferences 
      userId={userId} 
      onFinish={() => navigate("/")}  // redirect to home after saving preferences
    />
  );
};

export default QuizPage;
