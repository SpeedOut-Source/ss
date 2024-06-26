import { db } from "@/lib/db";
import EditableContent from "../chapters/[chapterId]/_components/editable-lesson-content";
import LessonEdit from "./lesson-edit";

interface LessonsProps {
  courseId: string;
  chapterId: string;
}

export default async function Lessons({ courseId, chapterId }: LessonsProps) {
  const lessons = await db.lesson.findMany({
    where: { topicId: "1" },
    include: { quiz: true },
  });

  return (
    <div>
      {lessons.map((lesson) => {
        if (lesson.quiz)
          return (
            <LessonEdit
              key={lesson.id}
              chapterId={chapterId}
              courseId={courseId}
              initialData={lesson.quiz}
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
