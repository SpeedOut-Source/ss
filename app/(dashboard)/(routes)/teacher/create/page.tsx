"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { AICourseDescriptionType } from "@/lib/type";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  prompt: z.string().min(20, {
    message: "Minimum 20 characters required",
  }),
});

const CreatePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const courseId = "courseId";
  const chapterId = "chapterId";
  const params = { courseId, chapterId };
  const [course, setCourse] = useState<AICourseDescriptionType>();

  const { isSubmitting, isValid } = form.formState;

  const queryClient = useQueryClient();

  const SaveGenerateCourse = async () => {
    const response = await axios.post("/api/courses", course);
    return response.data.id;
    // router.push(`/teacher/courses/${response.data.id}`);
  };

  // Mutations
  const mutation = useMutation({
    mutationFn: SaveGenerateCourse,
    onSuccess: (id) => {
      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Course created successfully");
      router.push(`/teacher/courses/${id}`);
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You are an expert in creating educational courses. Your task is to generate a detailed course outline. This should include a course courseName, description, and a breakdown into chapters. Each chapter should have a title and a brief description. Provide the response in JSON format.",
      },
      {
        role: "user",
        content: `Course Prompt: ${values.prompt}`,
      },
      {
        role: "user",
        content: `Generate the course outline in the following json format: {"courseName": "", description: "", "chapters": [{"title": "", "description": ""}, ...]} \n
        so that i can parse this return json as {courseName: string; description: string; chapters: { title: string; description: string }[] }
        `,
      },
    ];

    try {
      const response = await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/lesson/ai/course`,
        { messages }
      );
      const course = response.data as AICourseDescriptionType;
      console.log(course);
      setCourse(course);
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can
          change this later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g. 'Python for Intermediate Developers. this course would be for developers who have some experience with Python and want to take their skills to the next level.'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide information about What will you teach in this course
                    and who is the audience?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end  items-end gap-x-2">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    {"Generating"}{" "}
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div>
          {course && (
            <div>
              <h1 className="text-2xl">Course Outline</h1>
              <div className="space-y-4 mt-4">
                <div>
                  <h2 className="text-lg font-bold">{course.courseName}</h2>
                  <p>{course.description}</p>
                </div>
                <div>
                  <h2 className="text-lg font-bold">Chapters</h2>
                  <div className="space-y-4">
                    {course.chapters.map((chapter, index) => (
                      <div key={index}>
                        <h3 className="text-lg font-bold">{chapter.title}</h3>
                        <p>{chapter.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-x-2">
          <Link href="/">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={!isValid || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {"Saving"}{" "}
              </>
            ) : (
              "Save Course"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
