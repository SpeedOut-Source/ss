import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { db } from "@/lib/db";
import { Quiz } from "@prisma/client";
import { Pencil } from "lucide-react";
import React from "react";
import { QuizLesson } from "./lesson";
import LessonEdit from "./lesson-edit";

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
              chapterId={chapterId}
              courseId={courseId}
              initialData={lesson.quize}
            />
          );
      })}
    </div>
  );
}
