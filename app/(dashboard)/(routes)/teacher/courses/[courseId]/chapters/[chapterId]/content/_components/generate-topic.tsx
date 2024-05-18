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

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GenerateTopic() {
  const courseId = "courseId";
  const chapterId = "chapterId";
  const params = { courseId, chapterId };

  const chapterName = "Exceptions in Javascript";
  const chapterDescription =
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
      content: `Chapter Name: ${chapterName}\n\nChapter Description: ${chapterDescription}`,
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

  async function saveTopics() {
    const saveTopics = await axios.post(
      `/api/courses/${courseId}/chapters/${chapterId}/topic`,
      {
        topics,
      }
    );
  }

  // useEffect(() => {
  //   if (messages.length < 10) getAILessons();
  // }, [messages]);

  return (
    <div>
      {/* <Button onClick={getAILessons}>Generate</Button> */}
      <div className="">
        {topics.map((topic, index) => (
          <TopicCard key={index} topic={topic} />
        ))}
      </div>
      <div className="flex justify-between py-2">
        <Button onClick={getTopics}>Generate</Button>
        {topics.length > 0 && <Button>Save</Button>}
      </div>
    </div>
  );
}

function TopicCard({ topic }: { topic: TopicType }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{topic.title}</CardTitle>
        <CardDescription>{topic.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{topic.prompt}</p>
      </CardContent>
    </Card>
  );
}
