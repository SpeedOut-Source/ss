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

export const getChapterTopics = async ({
  messages,
}: {
  messages: ChatCompletionMessageParam[];
}) => {
  const input: ChatCompletionCreateParamsNonStreaming = {
    messages: messages,
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
  };

  const chatCompletion = await openai.chat.completions.create(input, {
    timeout: 10000, // 10s
  });

  const responseMessage = chatCompletion.choices[0].message.content;

  if (responseMessage) {
    const res = JSON.parse(responseMessage) as {
      topics: { title: string; description: string; prompt: string };
    };
    // console.log(res);
    return res.topics;
  }
};
