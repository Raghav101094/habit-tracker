export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <img src="/icon-192.png" alt="Daily Do" className="w-24 h-24 mx-auto mb-6" />
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-transparent bg-clip-text">
          Daily Do
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Build better habits, one day at a time
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Started
          </a>
          <a
            href="#features"
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>

      <div id="features" className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        <div className="p-6 border border-border rounded-lg">
          <div className="text-4xl mb-4">🔥</div>
          <h3 className="text-xl font-semibold mb-2">Track Streaks</h3>
          <p className="text-muted-foreground">
            Build momentum with visual streak tracking and never lose your progress
          </p>
        </div>

        <div className="p-6 border border-border rounded-lg">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">View Analytics</h3>
          <p className="text-muted-foreground">
            See your monthly completion rates and understand your patterns
          </p>
        </div>

        <div className="p-6 border border-border rounded-lg">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-xl font-semibold mb-2">Stay Motivated</h3>
          <p className="text-muted-foreground">
            Beautiful UI and satisfying checkmarks keep you coming back
          </p>
        </div>
      </div>
    </main>
  );
}
