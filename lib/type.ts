import { z } from "zod";

export const quizTypeSchema = z.object({
  question: z.string(),
  option1: z.string(),
  option2: z.string(),
  option3: z.string(),
  option4: z.string(),
  correctAnswer: z.number().min(1).max(4),
  explaination: z.string(),
});

export type QuizLessonType = z.infer<typeof quizTypeSchema>;
// {
//   question: string;
//   option1: string;
//   option2: string;
//   option3: string;
//   option4: string;
//   explanation: string;
//   correctAnswer: number;
// }

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
