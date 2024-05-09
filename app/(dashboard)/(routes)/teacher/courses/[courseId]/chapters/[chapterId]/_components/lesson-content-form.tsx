"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";

import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export interface LessonContentFormProps {
  initialData?: {
    id: string;
    textContent: string;
  };
  courseId: string;
  chapterId: string;
  toggleEdit?: () => void;
}

const formSchema = z.object({
  id: z.string().optional(),
  textContent: z.string().min(1),
});

export const LessonContentForm = ({
  initialData,
  courseId,
  chapterId,
  toggleEdit,
}: LessonContentFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      textContent: initialData?.textContent,
      id: initialData?.id,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}/lesson`,
        values
      );
      toast.success("Chapter updated");
      toggleEdit && toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  async function generateQuiz() {
    const toastId = toast.loading("Generating Text Content");
    try {
      const textContentRes = await axios.patch<string>(
        `/api/courses/${courseId}/chapters/${chapterId}/lesson/ai`
      );

      const textContent = textContentRes.data;

      form.setValue("textContent", textContent);

      toast.success("Content generated", { id: toastId });
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
            Add Content
          </div>
          <Button onClick={generateQuiz}>Generate</Button>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="textContent"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    disabled={isSubmitting}
                    placeholder="Add specific content for this lesson"
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
