"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Baby, Dumbbell, Swords } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";
import { Difficulty } from "@/types/quiz";

const DifficultyLevel = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("easy"); // Default to "easy"

  useEffect(() => {
    // Safely access cookies only on the client
    const savedDifficulty = Cookies.get("quizDifficulty") as Difficulty;
    if (savedDifficulty) {
      setSelectedDifficulty(savedDifficulty);
    }
  }, []);

  const difficulties = [
    {
      id: "easy",
      name: "Easy",
      icon: Baby,
      color: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-500",
    },
    {
      id: "medium",
      name: "Medium",
      icon: Dumbbell,
      color: "bg-yellow-100 dark:bg-yellow-900",
      iconColor: "text-yellow-500",
    },
    {
      id: "hard",
      name: "Hard",
      icon: Swords,
      color: "bg-red-100 dark:bg-red-900",
      iconColor: "text-red-500",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {difficulties.map((difficulty) => {
          const Icon = difficulty.icon;
          return (
            <Card
              key={difficulty.id}
              className={`p-4 cursor-pointer transition-colors ${
                selectedDifficulty === difficulty.id
                  ? "border-primary"
                  : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedDifficulty(difficulty.id as Difficulty)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${difficulty.color}`}>
                  <Icon className={`h-6 w-6 ${difficulty.iconColor}`} />
                </div>
                <span className="font-semibold text-xl">{difficulty.name}</span>
              </div>
            </Card>
          );
        })}
      </div>
      <Link
        href="/game"
        className="block text-center py-4 rounded-lg font-semibold w-full bg-[#A729F5] text-white"
        onClick={() => {
          Cookies.set("quizDifficulty", selectedDifficulty, {
            expires: 1,
          });
        }}
      >
        Start Quiz
      </Link>
    </div>
  );
};

export default DifficultyLevel;
