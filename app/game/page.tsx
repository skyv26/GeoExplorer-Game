import { Suspense } from "react"
// import { questions } from "./quiz"
import QuizComponent from "./quiz-component"
import { Skeleton } from "@/components/ui/skeleton"

const QuizPage = async() => {
  // const question = await (await fetch('http://localhost:3000/api/next-question')).json();

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<QuizSkeleton />}>
        <QuizComponent />
      </Suspense>
    </div>
  )
}

function QuizSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-full" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuizPage;
