// src/pages/QuizPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Preferences from "../components/Preferences";

const QuizPage = ({ userId, setIsLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <Preferences
      userId={userId}
      onFinish={() => {
        setIsLoggedIn(true);
        navigate("/home"); // go to homepage after preferences saved
      }}
    />
  );
};

export default QuizPage;
