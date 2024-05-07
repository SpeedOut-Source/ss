import { z } from "zod";

export const quizFormSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(1),
  option1: z.string().min(1),
  option2: z.string().min(1),
  option3: z.string().min(1),
  option4: z.string().min(1),
  // options: z.array(z.string()).min(2),
  correctAnswer: z.coerce.number().nonnegative().int().min(1).max(4),
  // explanation: z.string().optional(),
});
