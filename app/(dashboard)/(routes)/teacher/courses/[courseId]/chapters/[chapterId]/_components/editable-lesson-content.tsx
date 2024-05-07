"use client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import React, { useState } from "react";
import {
  LessonContentForm,
  LessonContentFormProps,
} from "./lesson-content-form";

export default function EditableContent({
  chapterId,
  courseId,
  initialData,
}: LessonContentFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Content
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
      {!isEditing && initialData && (
        <ShowContent content={initialData.textContent} />
      )}
      {isEditing && (
        <LessonContentForm
          chapterId={chapterId}
          courseId={courseId}
          initialData={initialData}
        />
      )}
    </div>
  );
}

function ShowContent({ content }: { content: string }) {
  return <p className="text-sm mt-2">{content}</p>;
}
