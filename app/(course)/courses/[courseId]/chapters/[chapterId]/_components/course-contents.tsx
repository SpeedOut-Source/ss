import { QuizLesson } from "@/components/content/quiz-content";
import { Preview } from "@/components/preview";
import { Lesson, Quiz } from "@prisma/client";

type OmiitedType = Omit<Lesson, "createdAt" | "updatedAt">;

export default function CourseContents({
  lessons,
  params,
}: {
  lessons: (OmiitedType & {
    quiz: Omit<Quiz, "createdAt" | "updatedAt"> | null;
  })[];

  params: { courseId: string; chapterId: string };
}) {
  return (
    <div>
      {lessons.map((lesson, i) => {
        if (lesson.quiz) return <QuizLesson key={i} quiz={lesson.quiz} />;
        else if (lesson.textContent) {
          return <Preview key={i} value={lesson.textContent} />; //<ShowContent key={i} content={lesson.textContent} />;
        }
      })}
    </div>
  );
}
