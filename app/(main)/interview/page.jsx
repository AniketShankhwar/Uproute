// app/(main)/interview/page.jsx
import { getAssessments } from "@/actions/interview";
import PerformanceChart from "./_components/performance-chart";
import QuizList from "./_components/quiz-list";
import StatsCards from "./_components/stats-cards";

export default async function InterviewPage() {
  let assessments;
  try {
    // Try fetching data—this can throw if your server action errors
    assessments = await getAssessments();
  } catch (error) {
    // Log the real error (you’ll see this in your server logs)
    console.error("Failed to load assessments:", error);
    // Render a user-friendly fallback UI
    return (
      <div className="p-6 text-center text-red-600">
        <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
        <p>We couldn’t load your quiz data. Please try again later.</p>
      </div>
    );
  }

  // Normal render path when fetch succeeds
  return (
    <div className="space-y-8">
      <h1 className="text-6xl font-bold gradient-title">Interview Prep</h1>
      <StatsCards assessments={assessments} />
      <PerformanceChart assessments={assessments} />
      <QuizList assessments={assessments} />
    </div>
  );
}
