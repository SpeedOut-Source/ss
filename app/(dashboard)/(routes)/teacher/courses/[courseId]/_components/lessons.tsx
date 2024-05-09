import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { db } from "@/lib/db";
import { Quiz } from "@prisma/client";
import { Edit, Pencil } from "lucide-react";
import React from "react";
import { QuizLesson } from "../../../../../../../components/content/quiz-content";
import LessonEdit from "./lesson-edit";
import EditableContent from "../chapters/[chapterId]/_components/editable-lesson-content";

interface LessonsProps {
  courseId: string;
  chapterId: string;
}

export default async function Lessons({ courseId, chapterId }: LessonsProps) {
  const lessons = await db.lesson.findMany({
    where: { chapterId: chapterId },
    include: { quize: true },
  });

  return (
    <div>
      {lessons.map((lesson) => {
        if (lesson.quize)
          return (
            <LessonEdit
              key={lesson.id}
              chapterId={chapterId}
              courseId={courseId}
              initialData={lesson.quize}
            />
          );

        if (lesson.textContent) {
          return (
            <EditableContent
              key={lesson.id}
              chapterId={chapterId}
              courseId={courseId}
              initialData={{ id: lesson.id, textContent: lesson.textContent }}
            />
          );
        }
      })}
    </div>
  );
}
