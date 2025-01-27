export interface Question {
    question: string
    options: {
      id: string
      text: string
    }[]
    correctAnswer: string
    hints: string[]
  }
  
  export interface QuizState {
    currentQuestion: number
    selectedAnswer: string | null
    isSubmitted: boolean
    hintsUsed: number
    timeRemaining: number
    showHint: boolean
    currentHint: number
  }
  
  export type Difficulty = "easy" | "medium" | "hard";
