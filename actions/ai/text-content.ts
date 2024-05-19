import OpenAI from "openai";
import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions.mjs";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export const getTextContentAI = async ({
  messages,
}: {
  messages: ChatCompletionMessageParam[];
}) => {
  const input: ChatCompletionCreateParamsNonStreaming = {
    messages: messages,
    model: "gpt-3.5-turbo",
    temperature: 0,
  };

  const chatCompletion = await openai.chat.completions.create(input, {
    timeout: 10000, // 10s
  });

  const responseMessage = chatCompletion.choices[0].message.content;

  if (responseMessage) {
    return responseMessage as string;
  }
};
