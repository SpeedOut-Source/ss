"use client";

// @ts-nocheck
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Topic } from "@prisma/client";
import { ArrowRightIcon, ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { Preview } from "@/components/preview";
import CourseQuiz from "./course-quiz";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoursePlayer({ topics }: { topics: Topic[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizView, setQuizView] = useState(false);

  const nextTopic = () => {
    if (currentIndex < topics.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    setQuizView(false);
  };

  const previousTopic = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    setQuizView(false);
  };

  const jumpToTopic = (index: number) => {
    setCurrentIndex(index);
    setQuizView(false);
  };

  const currentTopic = topics[currentIndex];

  const lessonsQ = trpc.getLessons.useQuery({ topicId: currentTopic.id });
  if (lessonsQ.isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Skeleton className="w-3/4 h-10 mb-4" />
        <Skeleton className="w-full h-64 mb-4" />
        <Skeleton className="w-full h-64" />
      </div>
    );
  if (lessonsQ.error) return <div>Error: {lessonsQ.error.message}</div>;

  const quizes = lessonsQ.data?.filter((lesson) => lesson.quiz !== null) || [];
  const lesson = lessonsQ.data?.find((lesson) => lesson.textContent);

  const progress = ((currentIndex + 1) / topics.length) * 100;

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto py-12 px-4">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{currentTopic.title}</h2>
            <p className="text-muted-foreground">{currentTopic.description}</p>
            <p className="text-gray-900">{currentTopic.prompt}</p>
          </div>
          <div className="mb-4 space-y-2">
            <Select onValueChange={(value: any) => jumpToTopic(Number(value))}>
              <SelectTrigger className="w-auto">
                <span>{topics[currentIndex].title}</span>
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic, index) => (
                  <SelectItem key={topic.id} value={index.toString()}>
                    {topic.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="h-2 w-full bg-gray-300 rounded">
              <div
                className="h-full bg-primary rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-right text-sm">
              {currentIndex + 1} / {topics.length} lessons completed
            </div>
          </div>
          <div className="mb-8">
            {quizView ? (
              <CourseQuiz lessons={quizes} />
            ) : (
              <Preview value={lesson?.textContent ?? ""} />
            )}
          </div>
          <div className="flex justify-between items-center gap-2">
            <Button onClick={previousTopic} disabled={currentIndex === 0}>
              <ArrowLeftIcon className="mr-2 h-5 w-5" />
              Back
            </Button>

            <div className="flex gap-2">
              {quizes.length > 0 && (
                <Button onClick={() => setQuizView((v) => !v)}>
                  {quizView ? "Close Quiz" : "Quiz"}
                </Button>
              )}
              <Button
                onClick={nextTopic}
                disabled={currentIndex === topics.length - 1}
              >
                Next
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
