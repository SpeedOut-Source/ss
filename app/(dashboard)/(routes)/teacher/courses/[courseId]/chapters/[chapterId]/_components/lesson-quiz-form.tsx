"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Quiz } from "@prisma/client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { QuizSchemaType, quizFormSchema } from "../interface/quiz";
import { QuizLesson } from "../../../../../../../../../components/content/quiz-content";

export interface QuizFormProps {
  initialData?: Quiz;
  courseId: string;
  chapterId: string;
  toggleEdit?: () => void;
}

export const QuizLessonForm = ({
  initialData,
  courseId,
  chapterId,
  toggleEdit,
}: QuizFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof quizFormSchema>>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: { ...initialData },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof quizFormSchema>) => {
    // console.log(values);
    try {
      const quizRes = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}/lesson/quiz`,
        values
      );

      toast.success("Quiz creater");
      toggleEdit && toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  async function generateQuiz() {
    const toastId = toast.loading("Generating Quiz");
    try {
      const quizRes = await axios.patch<QuizSchemaType>(
        `/api/courses/${courseId}/chapters/${chapterId}/lesson/quiz/ai`
      );

      const quiz = quizRes.data;

      form.setValue("question", quiz.question);
      form.setValue("option1", quiz.option1);
      form.setValue("option2", quiz.option2);
      form.setValue("option3", quiz.option3);
      form.setValue("option4", quiz.option4);
      form.setValue("correctAnswer", quiz.correctAnswer);

      toast.success("Quiz generated", { id: toastId });
      router.refresh();
    } catch {
      toast.error("Something went wrong", { id: toastId });
    }
  }

  return (
    <div className="mt-6 border bg-slate-200 rounded-md p-4">
      {!initialData && (
        <div className="flex justify-between">
          <div className="font-medium flex items-center justify-between">
            Add new Quiz
          </div>
          <Button onClick={generateQuiz}>Generate</Button>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem className="flex flex-col   space-y-3 rounded-md border px-4 pt-4">
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="e.g. 'What is something?'"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="option1"
            render={({ field }) => (
              <FormItem className="flex flex-col   space-y-3 rounded-md border px-4 ">
                <FormLabel>Option 1</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="e.g. 'What is something?'"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="option2"
            render={({ field }) => (
              // <FormItem className="flex flex-row items-center  space-x-3 space-y-0 rounded-md border p-4">
              <FormItem className="flex flex-col   space-y-3 rounded-md border px-4">
                <FormLabel>Option 2</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="e.g. 'What is something?'"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="option3"
            render={({ field }) => (
              // <FormItem className="flex flex-row items-center  space-x-3 space-y-0 rounded-md border p-4">
              <FormItem className="flex flex-col   space-y-3 rounded-md border px-4">
                <FormLabel>Option 3</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="e.g. 'What is something?'"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="option4"
            render={({ field }) => (
              // <FormItem className="flex flex-row items-center  space-x-3 space-y-0 rounded-md border p-4">
              <FormItem className="flex flex-col   space-y-3 rounded-md border px-4">
                <FormLabel>Option 4</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="e.g. 'What is something?'"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="correctAnswer"
            render={({ field }) => (
              // <FormItem className="flex flex-row items-center  space-x-3 space-y-0 rounded-md border p-4">
              <FormItem className="flex flex-col space-y-3 rounded-md border px-4 ">
                <FormLabel>Correct Answer</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    disabled={isSubmitting}
                    placeholder="What is the correct option"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-x-2">
            <Button disabled={!isValid || isSubmitting} type="submit">
              {initialData ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
