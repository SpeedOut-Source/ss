import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuizLessonForm } from "./lesson-quiz-form";
import { LessonContentForm } from "./lesson-content-form";

export default function AddLesson(params: {
  courseId: string;
  chapterId: string;
}) {
  return (
    <Tabs
      defaultValue="content"
      className="max-w-2xl mt-6 border bg-slate-100 rounded-md p-4"
    >
      <TabsList>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="quiz">Quiz</TabsTrigger>
      </TabsList>
      <TabsContent value="content">
        <LessonContentForm
          chapterId={params.chapterId}
          courseId={params.courseId}
        />
      </TabsContent>
      <TabsContent value="quiz">
        <QuizLessonForm
          chapterId={params.chapterId}
          courseId={params.courseId}
        />
      </TabsContent>
    </Tabs>
  );
}
