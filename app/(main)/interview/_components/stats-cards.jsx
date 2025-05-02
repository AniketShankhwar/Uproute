import Cards from "@/components/ui/cards";
import { Brain, Trophy } from "lucide-react";

const StatsCards = ({ assessments }) => {
  const getAverageScore = () => {
    if (!assessments?.length) return 0;
    const total = assessments.reduce(
      (sum, assessment) => sum + assessment.quizScore,
      0
    );
    return (total / assessments.length).toFixed(1);
  };

  const getLatestAssessment = () => {
    if (!assessments?.length) return null;
    return assessments[assessments.length - 1];
  };

  const getTotalQuestions = () => {
    if (!assessments?.length) return 0;
    return assessments.reduce(
      (sum, assessment) => sum + assessment.questions.length,
      0
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Cards>
        <div className="flex flex-row items-center justify-between space-y-0">
          <div className="text-lg font-semibold">Average Score</div>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">{getAverageScore()}%</div>
          <p className="text-sm text-muted-foreground">
            Across all assessments
          </p>
        </div>
      </Cards>

      <Cards>
        <div className="flex flex-row items-center justify-between space-y-0">
          <div className="text-lg font-semibold">Questions Practiced</div>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">{getTotalQuestions()}</div>
          <p className="text-sm text-muted-foreground">
            Total questions
          </p>
        </div>
      </Cards>

      <Cards>
        <div className="flex flex-row items-center justify-between space-y-0">
          <div className="text-lg font-semibold">Latest Score</div>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">{getLatestAssessment()?.quizScore.toFixed(1) || 0}%</div>
          <p className="text-sm text-muted-foreground">
            Most recent quiz
          </p>
        </div>
      </Cards>
    </div>
  );
};

export default StatsCards;
