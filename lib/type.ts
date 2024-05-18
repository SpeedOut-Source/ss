import { z } from "zod";

export interface QuizLessonType {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  explanation: string;
  correctAnswer: number;
}

export interface ContentLesson {
  content: string;
}

export const topicTypeSchema = z.object({
  title: z.string(),
  description: z.string(),
  prompt: z.string(),
});

export type TopicType = z.infer<typeof topicTypeSchema>;

export const aiCourseDescriptionSchema = z.object({
  courseName: z.string(),
  description: z.string(),
  chapters: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
});

export type AICourseDescriptionType = z.infer<typeof aiCourseDescriptionSchema>;
