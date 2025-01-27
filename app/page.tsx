import DifficultyLevel from "@/components/difficultyLevel/DifficultyLevel";

const Home = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Welcome to the Frontend Quiz!
            </h1>
            <p className="text-xl text-muted-foreground">
              Select difficulty level to get started.
            </p>
          </div>
          <DifficultyLevel />
        </div>
      </div>
    </main>
  );
};
export default Home;
