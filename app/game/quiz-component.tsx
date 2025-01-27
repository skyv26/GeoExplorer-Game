"use client";

import { useState, useEffect } from "react";
import type { Difficulty, Question } from "@/types/quiz";
import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress"
// import { HelpCircle, Sun, Moon } from 'lucide-react';
import { HelpCircle } from "lucide-react"
// import { useTheme } from "next-themes"
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";

// Replace the entire QuizComponent function with:
const QuizComponent = () => {
  const [state, setState] = useState<{
    currentQuestion: Question | null;
    selectedAnswer: string | null;
    isSubmitted: boolean;
    hintsUsed: number;
    timeRemaining: number;
    showHint: boolean;
    currentHint: number;
  }>({
    currentQuestion: null,
    selectedAnswer: null,
    isSubmitted: false,
    hintsUsed: 0,
    timeRemaining: 60,
    showHint: false,
    currentHint: 0,
  });

  const [difficultyLevel, setDifficultyLevel] = useState("Easy");

  useEffect(() => {
    setDifficultyLevel(Cookies.get("quizDifficulty") as Difficulty);
    fetchNextQuestion();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => ({
        ...prev,
        timeRemaining: prev.timeRemaining - 1,
        showHint: prev.timeRemaining === 30 && prev.hintsUsed < 2,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchNextQuestion = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/next-question");
      if (!response.ok) throw new Error("Failed to fetch question");
      const {
        question,
      }: {
        question: Question;
      } = await response.json();
      setState((prev) => ({
        ...prev,
        currentQuestion: question,
        isSubmitted: false,
        selectedAnswer: null,
        timeRemaining: 60,
        hintsUsed: 0,
        currentHint: 0,
        showHint: false,
      }));
    } catch (error) {
      console.error("Error fetching question:", error);
      setState((prev) => ({ ...prev, currentQuestion: null }));
    }
  };

  const handleAnswerSelect = (answerId: string) => {
    if (!state.isSubmitted) {
      setState((prev) => ({ ...prev, selectedAnswer: answerId }));
    }
  };

  const handleSubmit = () => {
    if (!state.selectedAnswer) return;
    setState((prev) => ({ ...prev, isSubmitted: true }));
  };

  if (!state.currentQuestion) {
    return <div>Loading...</div>;
  }

  // const progress =
  //   state.currentQuestion && initialQuestions.length
  //     ? ((initialQuestions.indexOf(state.currentQuestion) + 1) / initialQuestions.length) * 100
  //     : 0

  return (
    <div className="container mx-auto p-4 md:grid md:grid-cols-2 md:gap-8 md:items-start">
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg dark:bg-purple-900">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                <path d="M12 6a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm0 8a2 2 0 1 0 2 2 2 2 0 0 0-2-2z" />
              </svg>
            </div>
            {/* <h1 className="text-2xl font-bold">Accessibility</h1> */}
            <h1 className="text-2xl font-bold">{difficultyLevel}</h1>
          </div>
          {/* <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div> */}
        </header>

        <div className="space-y-4">
          {/* <p className="text-muted-foreground">
            Question {initialQuestions.indexOf(state.currentQuestion) + 1} of {initialQuestions.length}
          </p> */}
          {/* <Progress value={progress} className="h-2 bg-purple-100" /> */}
          <h2 className="text-2xl font-semibold">
            {state.currentQuestion?.question}
          </h2>
        </div>
      </div>

      <div className="mt-8 md:mt-0 space-y-6">
        <div className="space-y-4">
          <div className="mb-4 text-lg font-semibold">
            Time remaining: {state.timeRemaining} seconds
          </div>
          {state.currentQuestion?.options.map(
            (option: { id: string; text: string }) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                className={cn(
                  "w-full text-left px-6 py-4 rounded-lg border transition-colors",
                  "hover:bg-purple-50 dark:hover:bg-purple-900/20",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                  {
                    "border-purple-600 bg-purple-50 dark:bg-purple-900/20":
                      state.selectedAnswer === option.id && !state.isSubmitted,
                    "border-green-500 bg-green-50 dark:bg-green-900/20":
                      state.isSubmitted &&
                      option.id === state.currentQuestion?.correctAnswer,
                    "border-red-500 bg-red-50 dark:bg-red-900/20":
                      state.isSubmitted &&
                      state.selectedAnswer === option.id &&
                      option.id !== state.currentQuestion?.correctAnswer,
                    "border-gray-200 dark:border-gray-700":
                      state.selectedAnswer !== option.id && !state.isSubmitted,
                  }
                )}
                disabled={state.isSubmitted}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium",
                      {
                        "bg-purple-600 text-white":
                          state.selectedAnswer === option.id &&
                          !state.isSubmitted,
                        "bg-green-500 text-white":
                          state.isSubmitted &&
                          option.id === state.currentQuestion?.correctAnswer,
                        "bg-red-500 text-white":
                          state.isSubmitted &&
                          state.selectedAnswer === option.id &&
                          option.id !== state.currentQuestion?.correctAnswer,
                        "bg-gray-100 dark:bg-gray-800":
                          state.selectedAnswer !== option.id &&
                          !state.isSubmitted,
                      }
                    )}
                  >
                    {option.id}
                  </span>
                  <span className="flex-1">{option.text}</span>
                  {state.isSubmitted && (
                    <span className="ml-2">
                      {option.id === state.currentQuestion?.correctAnswer ? (
                        <svg
                          className="w-6 h-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : state.selectedAnswer === option.id ? (
                        <svg
                          className="w-6 h-6 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      ) : null}
                    </span>
                  )}
                </div>
              </button>
            )
          )}
        </div>

        <div className="space-y-4">
          {state.showHint && state.hintsUsed < 2 && state.currentQuestion && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Hint {state.currentHint + 1}:{" "}
                {state.currentQuestion.hints[state.currentHint]}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={}
              disabled={state.hintsUsed >= 2}
              className="flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{2 - state.hintsUsed} Hints Left</span>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!state.selectedAnswer || state.isSubmitted}
              className="px-8"
            >
              {state.isSubmitted ? "Next Question" : "Submit Answer"}
            </Button>
            {/* <Button
              onClick={state.isSubmitted ? fetchNextQuestion : handleSubmit}
              disabled={
                !state.currentQuestion ||
                (!state.selectedAnswer && !state.isSubmitted) ||
                state.timeRemaining <= 0
              }
              className="px-8"
            >
              {state.isSubmitted ? "Next Question" : "Submit Answer"}
            </Button> */}
          </div>

          {!state.selectedAnswer && state.isSubmitted && (
            <p className="text-red-500 text-sm text-center">
              Please select an answer
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;
