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
}

const formSchema = z.object({
  id: z.string().optional(),
  textContent: z.string().min(1),
});

export const LessonContentForm = ({
  initialData,
  courseId,
  chapterId,
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
      // toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-200 rounded-md p-4">
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
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
