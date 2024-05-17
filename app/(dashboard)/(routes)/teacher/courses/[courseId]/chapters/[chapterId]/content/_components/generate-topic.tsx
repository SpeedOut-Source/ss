"use client";

import { QuizLesson } from "@/components/content/quiz-content";
import { ShowContent } from "@/components/content/text-content";
import { IconBadge } from "@/components/icon-badge";
import { Button } from "@/components/ui/button";
import { ContentLesson, QuizLessonType, TopicType } from "@/lib/type";
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

  const [topics, setTopics] = useState<TopicType[]>([]);

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
      content: `Generate the topics and title, prompt, description for this chapter in the following json format:{"topics": [{"title": "", "description": "", "prompt": ""}, ...]} \n
        so that i can parse this return json as {topics:  { title: string; description: string; prompt: string } `,
    },
  ]);

  async function getTopics() {
    const topicsRes = await axios.post(
      `/api/courses/${courseId}/chapters/${chapterId}/lesson/ai/topics`,
      {
        messages,
      }
    );

    const topics = topicsRes.data as TopicType[];
    setTopics(topics);
    console.log(topicsRes);
  }

  // useEffect(() => {
  //   if (messages.length < 10) getAILessons();
  // }, [messages]);

  return (
    <div>
      {/* <Button onClick={getAILessons}>Generate</Button> */}
      <ul className="p-4">
        {topics.map((topic, index) => (
          <p key={index}>{topic.description}</p>
        ))}
      </ul>
      <button onClick={getTopics}>Generate</button>
    </div>
  );
}
