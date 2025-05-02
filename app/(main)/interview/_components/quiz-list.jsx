"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Cards from "@/components/ui/cards";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import QuizResult from "./quiz-result";

const QuizList = ({ assessments }) => {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  return (
    <>
      <Cards>
        <div className="flex flex-row items-center justify-between">
          <div>
            <div className="gradient-title font-semibold text-3xl md:text-4xl">
              Recent Quizzes
            </div>
            <div className="text-base text-muted-foreground">Review your past quiz performance</div>
          </div>
            <Button onClick={() => router.push("/interview/mock")}>
              Start New Quiz
            </Button>
        </div>
        <div>
          <div className="space-y-4">
            {assessments.map((assessment,i)=>{
              return (
                <Card 
                key={assessment.id}
                className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={()=> setSelectedQuiz(assessment)}
                >
                  <div>
                    <div className="text-lg font-semibold">Quiz {i + 1}</div>
                    <div className="flex justify-between w-full">
                      <div className="text-muted-foreground">Score: {assessment.quizScore.toFixed(1)}%</div>
                      <div>
                        {format(
                          new Date(assessment.createdAt),
                          "MMMM dd, yyyy HH:mm"
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-base text-muted-foreground">
                    <p>{assessment.improvementTip}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </Cards>

      {/* dialog */}
      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <QuizResult
            result={selectedQuiz}
            hideStartNew
            onStartNew={() => router.push("/interview/mock")}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuizList;
