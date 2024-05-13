import { ContentLesson, QuizLessonType } from "@/lib/type";
import OpenAI from "openai";
import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions.mjs";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export const getAILessons = async ({
  messages,
}: {
  messages: ChatCompletionMessageParam[];
}) => {
  const generateTextLesson: ChatCompletionTool = {
    type: "function",
    function: {
      name: "generateTextLesson",
      description:
        "Use this function to output user instruction. The function will output a course text lesson based on the user prompt.",
      parameters: {
        type: "object",
        properties: {
          content: {
            type: "string",
            description: "The course title generated by the function.",
          },
        },
        required: ["content"],
      },
    },
  };

  const generateQuizLesson: ChatCompletionTool = {
    type: "function",
    function: {
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
  };

  const tools: ChatCompletionTool[] = [generateTextLesson, generateQuizLesson];

  const input: ChatCompletionCreateParamsNonStreaming = {
    messages: messages,
    tools: tools,
    model: "gpt-3.5-turbo-1106",
    temperature: 0,
  };

  const chatCompletion = await openai.chat.completions.create(input, {
    timeout: 10000, // 10s
  });

  const responseMessage = chatCompletion.choices[0].message;

  const toolCalls = responseMessage.tool_calls;

  if (toolCalls) {
    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;

      if (functionName === "generateTextLesson") {
        const functionArguments = JSON.parse(
          toolCall.function.arguments
        ) as ContentLesson;
        return functionArguments;
      }

      if (functionName === "generateCourseLessonContentQuiz") {
        const functionArguments = JSON.parse(
          toolCall.function.arguments
        ) as QuizLessonType;

        return functionArguments;
      }
    }
  }
};
