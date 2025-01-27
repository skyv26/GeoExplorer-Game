"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Question } from "@/types/quiz"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { HelpCircle, X } from "lucide-react"
import Cookies from "js-cookie"
import { cn } from "@/lib/utils"

interface QuizClientProps {
  difficulty: string
  initialScore: number
}

const QuizClient: React.FC<QuizClientProps> = ({ difficulty, initialScore }) => {
  const router = useRouter()
  const [state, setState] = useState<{
    currentQuestion: Question | null
    selectedAnswer: string | null
    isSubmitted: boolean
    hintsUsed: number
    timeRemaining: number
    showHint: boolean
    currentHint: number
    score: number
    highestScore: number
  }>({
    currentQuestion: null,
    selectedAnswer: null,
    isSubmitted: false,
    hintsUsed: 0,
    timeRemaining: 60,
    showHint: false,
    currentHint: 0,
    score: initialScore,
    highestScore: 0,
  })

  useEffect(() => {
    const savedScore = Cookies.get("userScore")
    const savedHighestScore = Cookies.get("highestScore")
    setState((prev) => ({
      ...prev,
      score: savedScore ? Number.parseInt(savedScore) : initialScore,
      highestScore: savedHighestScore ? Number.parseInt(savedHighestScore) : 0,
    }))
    fetchNextQuestion()
  }, [initialScore])

  const fetchNextQuestion = async () => {
    try {
      const response = await fetch("/api/next-question")
      if (!response.ok) throw new Error("Failed to fetch question")
      const { question }: { question: Question } = await response.json()

      setState((prev) => ({
        ...prev,
        currentQuestion: question,
        isSubmitted: false,
        selectedAnswer: null,
        timeRemaining: 60,
        hintsUsed: 0,
        currentHint: 0,
        showHint: false,
      }))
    } catch {
      setState((prev) => ({ ...prev, currentQuestion: null }))
    }
  }

  const handleAnswerSelect = (answerId: string) => {
    if (!state.isSubmitted) {
      setState((prev) => ({ ...prev, selectedAnswer: answerId }))
    }
  }

  const handleSubmit = () => {
    if (!state.selectedAnswer) return

    const isCorrect = state.selectedAnswer === state.currentQuestion?.correctAnswer
    let scoreChange = 0

    if (isCorrect) {
      switch (difficulty) {
        case "easy":
          scoreChange = 2
          break
        case "medium":
          scoreChange = 4
          break
        case "hard":
          scoreChange = 10
          break
      }
    } else {
      switch (difficulty) {
        case "medium":
          scoreChange = -3
          break
        case "hard":
          scoreChange = -5
          break
      }
    }

    const newScore = Math.max(0, state.score + scoreChange)

    setState((prev) => ({
      ...prev,
      isSubmitted: true,
      score: newScore,
      highestScore: Math.max(prev.highestScore, newScore),
    }))

    Cookies.set("userScore", newScore.toString())
    Cookies.set("highestScore", Math.max(state.highestScore, newScore).toString())

    if (!isCorrect) {
      setTimeout(() => {
        handleGameOver()
      }, 1500) // Delay to show the correct answer before redirecting
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleGameOver = async () => {
    const finalScore = state.score
    const newHighestScore = Math.max(finalScore, state.highestScore)

    Cookies.set("userScore", finalScore.toString())
    Cookies.set("highestScore", newHighestScore.toString())
    document.cookie = "gameFinished=true; path=/"

    // Clear saved game state
    Cookies.remove("currentQuestion")
    Cookies.remove("timeRemaining")
    Cookies.remove("gameStarted")

    router.push("/gameover")
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => {
        const newTimeRemaining = prev.timeRemaining - 1
        if (newTimeRemaining <= 0) {
          clearInterval(timer)
          handleGameOver()
        }
        return {
          ...prev,
          timeRemaining: newTimeRemaining,
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [handleGameOver])

  
  const handleHintRequest = () => {
    if (state.hintsUsed < 2 || state.score >= 10) {
      setState((prev) => ({
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
        currentHint: prev.currentHint + 1,
        showHint: true,
        score: prev.hintsUsed >= 2 ? prev.score - 10 : prev.score,
      }))
      if (state.hintsUsed >= 2) {
        Cookies.set("userScore", (state.score - 10).toString())
      }
    }
  }

  const closeHint = () => {
    setState((prev) => ({
      ...prev,
      showHint: false,
    }))
  }

  if (!state.currentQuestion) {
    return <div>Loading...</div>
  }

  const progressValue = (state.timeRemaining / 60) * 100
  const progressColor =
    difficulty === "easy" ? "bg-green-500" : difficulty === "medium" ? "bg-yellow-500" : "bg-red-500"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>Current Score: {state.score}</div>
        <div>Highest Score: {state.highestScore}</div>
      </div>
      <Progress value={progressValue} className={`h-2 ${progressColor}`} />
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{state.currentQuestion?.question}</h2>
      </div>

      <div className="space-y-4">
        {state.currentQuestion?.options.map((option: { id: string; text: string }) => (
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
                  state.isSubmitted && option.id === state.currentQuestion?.correctAnswer,
                "border-red-500 bg-red-50 dark:bg-red-900/20":
                  state.isSubmitted &&
                  state.selectedAnswer === option.id &&
                  option.id !== state.currentQuestion?.correctAnswer,
                "border-gray-200 dark:border-gray-700": state.selectedAnswer !== option.id && !state.isSubmitted,
              },
            )}
            disabled={state.isSubmitted}
          >
            <div className="flex items-center gap-4">
              <span
                className={cn("flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium", {
                  "bg-purple-600 text-white": state.selectedAnswer === option.id && !state.isSubmitted,
                  "bg-green-500 text-white": state.isSubmitted && option.id === state.currentQuestion?.correctAnswer,
                  "bg-red-500 text-white":
                    state.isSubmitted &&
                    state.selectedAnswer === option.id &&
                    option.id !== state.currentQuestion?.correctAnswer,
                  "bg-gray-100 dark:bg-gray-800": state.selectedAnswer !== option.id && !state.isSubmitted,
                })}
              >
                {option.id}
              </span>
              <span className="flex-1">{option.text}</span>
              {state.isSubmitted && (
                <span className="ml-2">
                  {option.id === state.currentQuestion?.correctAnswer ? (
                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : state.selectedAnswer === option.id ? (
                    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : null}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {state.showHint && state.currentQuestion && (
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg relative">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Hint {state.currentHint}: {state.currentQuestion.hints[state.currentHint - 1]}
            </p>
            <button onClick={closeHint} className="absolute top-2 right-2 text-purple-700 dark:text-purple-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleHintRequest}
            disabled={state.showHint || (state.hintsUsed >= 2 && state.score < 10)}
            className="flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{state.hintsUsed < 2 ? `Hint (${2 - state.hintsUsed} free left)` : "Buy Hint (10 points)"}</span>
          </Button>
          {!state.isSubmitted && (
            <Button onClick={handleSubmit} disabled={!state.selectedAnswer} className="px-8">
              Submit Answer
            </Button>
          )}
          {state.isSubmitted && state.selectedAnswer === state.currentQuestion?.correctAnswer && (
            <Button onClick={fetchNextQuestion} className="px-8">
              Next Question
            </Button>
          )}
        </div>

        {!state.selectedAnswer && state.isSubmitted && (
          <p className="text-red-500 text-sm text-center">Please select an answer</p>
        )}
      </div>
    </div>
  )
}

export default QuizClient

