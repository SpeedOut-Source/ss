import { db } from "@/lib/db";
import { publicProcedure, router } from "./trpc";
import { getChapterTopics } from "@/actions/ai/get-ai-topics";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { z } from "zod";
import { topicTypeSchema } from "@/lib/type";

export const appRouter = router({
  getTodos: publicProcedure.query(async () => {
    return "vongcong";
  }),
  generateTopics: publicProcedure
    .input(
      z.object({
        chapterName: z.string(),
        chapterDescription: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { chapterName, chapterDescription } = input;
      const messages: ChatCompletionMessageParam[] = [
        {
          role: "system",
          content:
            "You are an expert in programming and instructional design. Your task is to generate a list of topics and corresponding prompts for a given chapter of a programming course. Each topic should have a title, a brief description, and a prompt to generate content for that topic.",
        },
        {
          role: "user",
          content: `Chapter Name: ${chapterName}\n\nChapter Description: ${chapterDescription}`,
        },
        {
          role: "user",
          content: `Generate the topics and title, prompt, description for this chapter in the following json format:{"topics": [{"title": "", "description": "", "prompt": ""}, ...]} \n
        so that i can parse this return json as {topics:  { title: string; description: string; prompt: string }[]}`,
        },
      ];
      const quizes = await getChapterTopics({ messages });
      return quizes;
    }),

  getTopics: publicProcedure
    .input(z.object({ chapterId: z.string() }))
    .query(async ({ input }) => {
      const topics = await db.topic.findMany({
        where: { chapterId: input.chapterId },
      });
      return topics;
    }),
  saveTopics: publicProcedure
    .input(
      z.object({
        courseId: z.string(),
        topics: z.array(topicTypeSchema),
        userId: z.string(),
        chapterId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, courseId, chapterId } = input;
      const ownCourse = await db.course.findUnique({
        where: {
          id: courseId,
          userId,
        },
      });

      // if (!ownCourse) {
      //   throw new Error("Unauthorized");
      // }

      const topics = input.topics;

      return await db.topic.createMany({
        data: topics.map((topic, i) => ({
          ...topic,
          chapterId,
          Order: i,
        })),
      });
    }),

  getLessons: publicProcedure
    .input(z.object({ topicId: z.string() }))
    .query(async ({ input }) => {
      const { topicId } = input;
      const lessons = await db.lesson.findMany({
        where: { topicId: topicId },
        include: { quiz: true },
      });
      return lessons;
    }),
});

export type AppRouter = typeof appRouter;
