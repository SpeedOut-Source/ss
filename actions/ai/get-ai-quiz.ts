import OpenAI from "openai";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions.mjs";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export const getAIQuiz = async (prompt?: string | null) => {
  if (prompt == null) return false;

  const input: ChatCompletionCreateParamsNonStreaming = {
    messages: [
      {
        role: "system",
        content:
          "Don't make assumptions about what values to plug into functions",
      },
      {
        role: "system",
        content:
          "Give a course content based on the following chapter and user prompt. Content will be in the form of a quiz.",
      },
      { role: "user", content: prompt },
    ],
    functions: [
      {
        name: "generateCourseLessonContentQuiz",
        description:
          "Use this function to output user instruction. The function will output a quiz content based on the course chapter.",
        parameters: {
          type: "object",
          properties: {
            question: {
              type: "string",
              description: "The question related to the course chapter",
            },
            option1: {
              type: "string",
              description: "Option 1 for the question",
            },
            option2: {
              type: "string",
              description: "Option 2 for the question",
            },
            option3: {
              type: "string",
              description: "Option 3 for the question",
            },
            option4: {
              type: "string",
              description: "Option 4 for the question",
            },
            explanation: {
              type: "string",
              description: "Explanation for the correct answer",
            },
            correctAnswer: {
              type: "integer",
              minimum: 1,
              maximum: 4,
              description:
                "The correct answer for the question. 1 for option1, 2 for option2, and so on.",
            },
          },
          required: [
            "question",
            "option1",
            "option2",
            "option3",
            "option4",
            "explanation",
            "correctAnswer",
          ],
        },
      },
    ],
    model: "gpt-3.5-turbo",
    temperature: 0,
  };

  const chatCompletion = await openai.chat.completions.create(input, {});

  const quiz = JSON.parse(
    chatCompletion.choices[0].message.function_call?.arguments!
  );

  return quiz || false;
};
