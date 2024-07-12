// @ts-nocheck
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lesson, Quiz } from "@prisma/client";
import { useState } from "react";

type OmittedType = Omit<Lesson, "createdAt" | "updatedAt">;

export default function CourseQuiz({
  lessons,
}: {
  lessons: (OmittedType & {
    quiz: Omit<Quiz, "createdAt" | "updatedAt"> | null;
  })[];
}) {
  const [showAns, setShowAns] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [score, setScore] = useState<number | null>(null);
  const [incomplete, setIncomplete] = useState(false);

  const toggleShowAns = () => {
    if (showAns) {
      setSelectedAnswers({});
      setScore(null);
    } else {
      if (Object.keys(selectedAnswers).length !== lessons.length) {
        setIncomplete(true);
        return;
      }
      setIncomplete(false);
      calculateScore();
    }
    setShowAns(!showAns);
  };

  const handleOptionChange = (lessonIndex: number, value: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [lessonIndex]: value }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    lessons.forEach((lesson, i) => {
      if (
        lesson.quiz &&
        selectedAnswers[i] ===
          lesson?.quiz![`option${lesson!.quiz!.correctAnswer}`]
      ) {
        correctCount++;
      }
    });
    setScore(correctCount);
  };

  return (
    <div className="flex flex-col h-full w-full mx-auto bg-background rounded-lg shadow-lg overflow-hidden">
      <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Quiz</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm">Question {lessons.length}</span>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-6 space-y-5">
        {lessons.map((lesson, i) => (
          <div key={i} className="grid gap-6">
            <div>
              <h2 className="text-lg font-medium mb-2">
                {lesson.quiz?.question}
              </h2>
              <RadioGroup
                value={selectedAnswers[i] || ""}
                onValueChange={(value) => handleOptionChange(i, value)}
              >
                {lesson.quiz &&
                  [
                    "option1",
                    "option2",
                    "option3",
                    "option4",
                    "option5",
                    "option6",
                  ].map((option, index) => {
                    const optionValue = lesson.quiz[option];
                    return optionValue ? (
                      <div key={option} className="space-x-2">
                        <RadioGroupItem
                          value={optionValue}
                          id={`${option}${i}`}
                        />
                        <Label
                          htmlFor={`${option}${i}`}
                          className={
                            showAns && lesson.quiz.correctAnswer === index + 1
                              ? "text-green-500"
                              : ""
                          }
                        >
                          {optionValue}
                        </Label>
                      </div>
                    ) : null;
                  })}
              </RadioGroup>
            </div>
            {showAns && lesson.quiz?.explanation && (
              <div className="text-sm text-muted-foreground">
                {lesson.quiz.explanation}
              </div>
            )}
          </div>
        ))}
        {score !== null && (
          <div className="text-lg font-medium">
            Your score: {score} / {lessons.length}
          </div>
        )}
        {incomplete && (
          <div className="text-sm text-red-500">
            Please complete all questions before checking the answers.
          </div>
        )}
      </div>
      <footer className="bg-muted text-muted-foreground p-4 flex justify-end">
        <Button onClick={toggleShowAns}>
          {showAns ? "Clear Answer" : "Check Answer"}
        </Button>
      </footer>
    </div>
  );
}
