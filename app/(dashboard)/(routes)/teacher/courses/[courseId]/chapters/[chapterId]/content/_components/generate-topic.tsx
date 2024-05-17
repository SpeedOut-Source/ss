"use client";

import { QuizLesson } from "@/components/content/quiz-content";
import { ShowContent } from "@/components/content/text-content";
import { IconBadge } from "@/components/icon-badge";
import { Button } from "@/components/ui/button";
import { ContentLesson, QuizLessonType } from "@/lib/type";
import { Quiz } from "@prisma/client";
import axios from "axios";
import { LayoutDashboard } from "lucide-react";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import React, { useEffect, useState } from "react";

export default function GenerateTopic() {
  const courseId = "courseId";
  const chapterId = "chapterId";
  const params = { courseId, chapterId };

  const chpaterTitle = "Exceptions in Javascript";
  const description =
    "This chapter covers the basics of exceptions in Javascript";

  const [respone, setResponse] = useState<(ContentLesson | QuizLessonType)[]>(
    []
  );

  let [messages, setMessage] = useState<ChatCompletionMessageParam[]>([
    {
      role: "system",
      content:
        "You are an expert in programming and instructional design. Your task is to generate a list of topics and corresponding prompts for a given chapter of a programming course. Each topic should have a title, a brief description, and a prompt to generate content for that topic.",
    },
    {
      role: "user",
      content:
        "Chapter Name: {chapterName}\n\nChapter Description: {chapterDescription}",
    },
    {
      role: "user",
      content:
        'Generate the topics and prompts for this chapter in the following json format: [{"topic": "", "description": "", "prompt": ""}, ...]',
    },
  ]);

  async function getTopics() {
    const lessonRes = await axios.post(
      `/api/courses/${courseId}/chapters/${chapterId}/lesson/ai/topics`,
      {
        messages: [
          ...messages,
          {
            role: "user",
            content:
              "I've provided previous functions args so that you can predict which function to call next to gernate lesson.",
          },
        ],
      }
    );
  }

  // useEffect(() => {
  //   if (messages.length < 10) getAILessons();
  // }, [messages]);

  return (
    <div>
      {/* <Button onClick={getAILessons}>Generate</Button> */}
      <ul className="p-4">
        {respone.map((res) => (
          <li className="m-2 bg-slate-200 p-2">
            {"content" in res ? (
              <ShowContent content={res.content} />
            ) : (
              <QuizLesson quiz={res as Quiz} />
            )}
          </li>
        ))}
      </ul>
      <button onClick={getTopics}>Generate</button>
    </div>
  );
}
