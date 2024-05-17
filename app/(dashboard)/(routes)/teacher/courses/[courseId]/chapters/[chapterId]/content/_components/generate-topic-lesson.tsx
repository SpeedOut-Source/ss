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

export default function GenerateTopicLesson() {
  const courseId = "courseId";
  const chapterId = "chapterId";
  const params = { courseId, chapterId };

  const [loading, setLoading] = useState(false);
  const [lessonIndex, setLessonIndex] = useState(1);

  const [respone, setResponse] = useState<(ContentLesson | QuizLessonType)[]>(
    []
  );

  let [messages, setMessage] = useState<ChatCompletionMessageParam[]>([
    {
      role: "system",
      content: `You are a helpful assistant that generate quiz questions based on a topic. Respond with one  question and four plausible options/answers, of which only one is correct. Provide your answer in JSON structure like this {"question": "<The quiz question you generate>", "option1": "<Plausible option 1>", "option2":  "<Plausible option 2>",  "option3":  "<Plausible option 3>", "correctAnswer": "< number of option that is correct>", "explanation": "<Explanation of the correct answer>"}.`,
    },

    { role: "user", content: "prompt" },
  ]);

  async function getAILessons() {
    setLoading(true);
    const lessonRes = await axios.post(
      `/api/courses/${courseId}/chapters/${chapterId}/lesson/ai/all`,
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

    const lesson = lessonRes.data;
    if (lesson) {
      const less = lesson as ContentLesson | QuizLessonType;

      if ("content" in less) {
        const message: ChatCompletionMessageParam = {
          role: "system",
          content: `Lesson ${lessonIndex}: 

                    functionArgs of generateTextLesson was: ${less}


                         `,
        };
        setMessage((prevMessages) => [...prevMessages, message]);
      } else {
        const lesson = less;
        const message: ChatCompletionMessageParam = {
          role: "system",
          content: `Lesson no: ${lessonIndex}
                      functoin args of generateCourseLessonContentQuiz was: ${less}

                    `,
        };
        setMessage((prevMessages) => [...prevMessages, message]);
      }
      setResponse((prev) => [...prev, less]);
    }
    setLoading(false);
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
        {loading && <li>Generating...</li>}
      </ul>
    </div>
  );
}
