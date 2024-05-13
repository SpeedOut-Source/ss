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

export default function TestPage() {
  const courseId = "courseId";
  const chapterId = "chapterId";
  const params = { courseId, chapterId };
  const concept = { chapterName: "Javascript", courseName: "Javascript Types" };

  const [loading, setLoading] = useState(false);
  const [lessonIndex, setLessonIndex] = useState(1);

  const [respone, setResponse] = useState<(ContentLesson | QuizLessonType)[]>(
    []
  );

  let [messages, setMessage] = useState<ChatCompletionMessageParam[]>([
    {
      role: "system",
      content: `You are provided a course title ${concept.courseName} and one of its course  chapter name ${concept.chapterName}. Now you have to generate the full chapter content
        Here chapter content's are in the form of text and quiz.
        Generate a series of lessons on a given topic, alternating between text content and quiz questions, to facilitate learning and assessment for students. The lessons should maintain relevance and consistency with each other, gradually building on the understanding of the topic.
        first two lessons should be text content lessons, followed by a quiz lesson, and so on. The lessons should be engaging, informative, and challenging, encouraging active participation and critical thinking. and the last lesson should be a summary of the chapter.
        the total number of lessons should be 10.
        
        Text Content Lessons:
            Begin by generating text content for the first lesson introducing the concept of ${concept.chapterName}. Ensure clarity, coherence, and relevance to students' learning.
            Follow up with additional text lessons that expand on the concept, providing examples, practical applications, and exploring related topics. Each subsequent text lesson should build upon the knowledge gained from the previous one.
        Quiz Lessons:
            generate quiz questions to test students' understanding of the concept introduced. Include a mix of multiple-choice, true/false, and short-answer questions. Ensure that the quizzes align closely with the content covered in the preceding lesson.
            Create progressively challenging quiz questions as the lessons progress, encouraging deeper engagement and critical thinking skills.
        Lesson Summary and Examples:
            At the conclusion of the lesson series, generate a summary that highlights the key points covered in the text content and quizzes. Summarize the main concepts, insights gained, and practical applications.
            Provide examples or case studies that illustrate the application of the concept in real-world scenarios, reinforcing understanding and relevance for students
        `,
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
