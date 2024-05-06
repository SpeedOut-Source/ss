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
import { quizFormSchema } from "../interface/quiz";

interface QuizFormProps {
  initialData?: Quiz;
  courseId: string;
  chapterId: string;
}

export const QuizLessonForm = ({
  initialData,
  courseId,
  chapterId,
}: QuizFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof quizFormSchema>>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: { ...initialData },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof quizFormSchema>) => {
    // console.log(values);
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}/lesson/quiz`,
        values
      );
      toast.success("Quiz creater");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

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
      {!isEditing && (
        <p className={cn("text-sm mt-2")}>This chapter is free for preview.</p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center  space-x-3 space-y-0 rounded-md border p-4">
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
                <FormItem className="flex flex-row items-center  space-x-3 space-y-0 rounded-md border p-4">
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
                <FormItem className="flex flex-row items-center  space-x-3 space-y-0 rounded-md border p-4">
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
                <FormItem className="flex flex-row items-center  space-x-3 space-y-0 rounded-md border p-4">
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
                <FormItem className="flex flex-row items-center  space-x-3 space-y-0 rounded-md border p-4">
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
              name="correctOption"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center  space-x-3 space-y-0 rounded-md border p-4">
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
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
