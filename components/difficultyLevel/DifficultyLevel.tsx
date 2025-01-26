"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Utility functions for cookies
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number): void => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
};

const DifficultyLevel: React.FC = () => {
  // State to store selected difficulty
  const [difficulty, setDifficulty] = useState<string>(
    getCookie("difficulty") ?? "easy"
  );
  const [currentUserScore] = useState<string>(getCookie("userScore") ?? "0");

  useEffect(() => {
    const userScore = getCookie("userScore");
    if (!userScore) {
      setCookie("userScore", "0", 7);
    }
  }, []);

  // Handle difficulty selection
  const handleDifficultyChange = (level: string): void => {
    setDifficulty(level);
  };

  // Save difficulty level in cookies when Play is pressed
  const handlePlay = (): void => {
    setCookie("difficulty", difficulty, 7);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Select Difficulty Level</h2>
      <ul className="mb-4 flex gap-4">
        {[
          { label: "Easy", value: "easy" },
          { label: "Medium", value: "medium" },
          { label: "Hard", value: "hard" },
        ].map((option) => (
          <li
            key={option.value}
            className={`cursor-pointer p-2 rounded border ${
              difficulty === option.value
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
            onClick={() => handleDifficultyChange(option.value)}
          >
            {option.label}
          </li>
        ))}
      </ul>
      <Link href="/game">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handlePlay}
        >
          Play
        </button>
      </Link>
      <div>
        <strong>
          Coins: <span>{currentUserScore}</span>
        </strong>
      </div>
    </div>
  );
};

export default DifficultyLevel;
