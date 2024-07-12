import { QuizLessonType } from "@/lib/type";
import OpenAI from "openai";
import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions.mjs";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export const getQuizContentAI = async ({
  messages,
}: {
  messages: ChatCompletionMessageParam[];
}) => {
  console.log("messages", messages);
  const input: ChatCompletionCreateParamsNonStreaming = {
    messages: messages,
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
  };

  const chatCompletion = await openai.chat.completions.create(input, {});

  const responseMessage = chatCompletion.choices[0].message.content;

  if (responseMessage) {
    const res = JSON.parse(responseMessage) as {
      quizes: QuizLessonType[];
    };
    console.log(res);
    return res.quizes;
  }
};
