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
  const quizes = lessons.filter((lesson) => lesson.quiz);
  const lesson = lessons.find((lesson) => lesson.textContent);

  return (
    <div>
      {lesson && <Preview value={lesson.textContent ?? ""} />}
      {quizes.map((lesson, i) => {
        if (lesson.quiz) return <QuizLesson key={i} quiz={lesson.quiz} />;
      })}
    </div>
  );
}
