"use client";

import { QuizLessonType, TopicType, quizTypeSchema } from "@/lib/type";
import axios from "axios";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QuizLesson } from "@/components/content/quiz-content";
import { Preview } from "@/components/preview";
import LoadingButton from "@/components/ui/loading";
import toast from "react-hot-toast";
import { z } from "zod";

export default function GenerateContent({
  params,
  topic,
  topicId,
}: {
  params: { courseId: string; chapterId: string };
  topic: TopicType;
  topicId: string;
}) {
  const { courseId, chapterId } = params;

  const [content, setContent] = useState<string>();
  const [quizes, setQuizes] = useState<QuizLessonType[]>();

  const queryClient = useQueryClient();

  async function AITextContentGen() {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You are an expert in programming and instructional design. Your task is to generate content of topic based on the topic descriptoin/outline for a given chapter of a programming course. Response should be in rich text formate so that heading, bold, italic and bullete point are included",
      },
      {
        role: "user",
        content: `Topic Name: ${topic.title}\n\nTopic Description/outline: ${topic.description}`,
      },
      {
        role: "user",
        content: `${topic.prompt}`,
      },
      {
        role: "user",
        content: `Generate the topic content.`,
      },
    ];
    const contentRes = await axios.post(
      `/api/courses/${courseId}/chapters/${chapterId}/lesson/ai/content`,
      {
        messages,
      }
    );

    const content = contentRes.data as string;
    return content;
    // setContent(content);
    // console.log(topicsRes);
  }

  async function AIQuizContentGen() {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `You are an expert in programming and instructional design. Your task is to generate quizes content of topic based on the topic descriptoin/outline for a given chapter of a programming course. \n
           Each quiz should have  question, option1, option2, option3, option4, correctAnswer( this will be number 1 to 4), and explanation to the quiz`,
      },
      {
        role: "user",
        content: `Topic Name: ${topic.title}\n\nTopic Description/outline: ${topic.description}`,
      },
      {
        role: "user",
        content: `content of the topic ${content}`,
      },
      {
        role: "user",
        content: `Generate the quizes with following properties  in the following json format:{"quizes": [{"question": "", "option1": "", "option2": ""}, ...]} \n
        so that i can parse this return json as {quizes:  { question: string; option1: string; option2: string; option3: string; option4: string; correctAnswer: number; explanation: string;}[]}} `,
      },
    ];
    const quizzesRes = await axios.patch(
      `/api/courses/${courseId}/chapters/${chapterId}/lesson/ai/content`,
      {
        messages,
      }
    );

    const data = z.array(quizTypeSchema).safeParse(quizzesRes.data);
    if (data.success) {
      const quizzes = data.data;
      return quizzes;
    } else {
      // toast.error("Error in quiz generation");
      throw new Error("Error in quiz generation");
    }

    // setTopics(topics);
    // console.log(topicsRes);
  }

  // Mutations
  const textContentM = useMutation({
    mutationFn: AITextContentGen,
    onSuccess: (content) => {
      setContent(content);

      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const quizM = useMutation({
    mutationFn: AIQuizContentGen,
    onSuccess: (quizzes) => {
      setQuizes(quizzes);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  async function saveLessons() {
    const saveTopics = await axios.post(
      `/api/courses/${courseId}/chapters/${chapterId}/topic/lesson`,
      { content, quizes, topicId }
    );
  }

  const saveMutation = useMutation({
    mutationFn: saveLessons,
    onSuccess: () => {
      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Saved successfully");
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  return (
    <div className="max-w-xl">
      {/* <Button onClick={getAILessons}>Generate</Button> */}
      {/* <div className="">{content}</div> */}
      {content && <Preview value={content} />}
      {quizes?.map((quiz, index) => (
        <QuizLesson key={index} quiz={quiz} />
      ))}
      <div className="flex justify-between py-2">
        {content ? (
          <LoadingButton
            onClick={() => quizM.mutate()}
            content={content ? "Regenerate Quizes" : "Generate Quizes"}
            loading={quizM.isPending}
            loadingContent={content ? "Regenerating" : "Generating"}
          />
        ) : (
          <LoadingButton
            onClick={() => textContentM.mutate()}
            content={content ? "Regenerate" : "Generate"}
            loading={textContentM.isPending}
            loadingContent={content ? "Regenerating" : "Generating"}
          />
        )}

        {content && quizes && (
          <LoadingButton
            onClick={() => saveMutation.mutate()}
            content={"Save"}
            loading={saveMutation.isPending}
            loadingContent={"Saving"}
          />
        )}
      </div>
    </div>
  );
}
