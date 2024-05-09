"use client";
import React from "react";
import {
  QuizFormProps,
  QuizLessonForm,
} from "../chapters/[chapterId]/_components/lesson-quiz-form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { QuizLesson } from "../../../../../../../components/content/quiz-content";

export default function LessonEdit({
  initialData,
  courseId,
  chapterId,
}: QuizFormProps) {
  const [isEditing, setIsEditing] = React.useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Quiz
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Quiz
            </>
          )}
        </Button>
      </div>
      {!isEditing && initialData && <QuizLesson quiz={initialData} />}
      {isEditing && (
        <QuizLessonForm
          chapterId={chapterId}
          courseId={courseId}
          initialData={initialData}
          toggleEdit={toggleEdit}
        />
      )}
    </div>
  );
}
