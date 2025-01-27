import { Suspense } from "react";
import { cookies } from "next/headers";
import QuizClient from "./quizClient";

const QuizPage = async () => {
  // Fetch cookies server-side
  const cookieStore = await cookies();
  const difficulty = cookieStore.get("quizDifficulty")?.value || "Easy";
  const userScore = Number.parseInt(cookieStore.get("userScore")?.value || "0");

  // Pass necessary data as props to the client component
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Quiz Game - {difficulty}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <QuizClient difficulty={difficulty} initialScore={userScore} />
      </Suspense>
    </div>
  );
}

export default QuizPage;