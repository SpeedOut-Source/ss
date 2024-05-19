"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuizLessonType } from "@/lib/type";
import { Quiz } from "@prisma/client";
import { Pencil } from "lucide-react";
import React from "react";

export function QuizLesson({ quiz }: { quiz: QuizLessonType }) {
  const options = [quiz.option1, quiz.option2, quiz.option3, quiz.option4];

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        {quiz.question}
      </div>
      <RadioGroup defaultValue="option-one">
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={option} />
            <Label htmlFor="option-one">{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
