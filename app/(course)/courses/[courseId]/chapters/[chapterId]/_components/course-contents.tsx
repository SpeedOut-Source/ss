import { QuizLesson } from "@/components/content/quiz-content";
import { ShowContent } from "@/components/content/text-content";
import { db } from "@/lib/db";
import { Course, Lesson, Quiz } from "@prisma/client";
import React from "react";

export default async function CourseContents({
  lessons,
  params,
}: {
  lessons: (Lesson & { quize: Quiz | null })[];
  params: { courseId: string; chapterId: string };
}) {
  return (
    <div>
      {lessons.map((lesson, i) => {
        if (lesson.quize) return <QuizLesson key={i} quiz={lesson.quize} />;
        else if (lesson.textContent) {
          return <ShowContent key={i} content={lesson.textContent} />;
        }
      })}
    </div>
  );
}
