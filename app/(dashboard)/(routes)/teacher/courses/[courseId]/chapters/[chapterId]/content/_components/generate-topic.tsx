"use client";

import { Button } from "@/components/ui/button";
import { TopicType } from "@/lib/type";
import { Chapter } from "@prisma/client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import TopicCard from "./topic-card";

export default function GenerateTopic({
  params,
  chapter,
}: {
  params: { courseId: string; chapterId: string };
  chapter: Chapter;
}) {
  const { courseId, chapterId } = params;

  const chapterName = chapter.title;
  const chapterDescription = chapter.description;

  const [topics, setTopics] = useState<TopicType[]>();

  const queryClient = useQueryClient();

  async function AIChapterTopics() {
    const messages: ChatCompletionMessageParam[] = [
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
        so that i can parse this return json as {topics:  { title: string; description: string; prompt: string }[]}`,
      },
    ];
    const topicsRes = await axios.post(
      `/api/courses/${courseId}/chapters/${chapterId}/lesson/ai/topics`,
      {
        messages,
      }
    );

    const topics = topicsRes.data as TopicType[];
    return topics;
    // setTopics(topics);
    // console.log(topicsRes);
  }

  // Mutations
  const aiMutation = useMutation({
    mutationFn: AIChapterTopics,
    onSuccess: (topics) => {
      setTopics(topics);

      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  async function saveTopics() {
    const saveTopics = await axios.post(
      `/api/courses/${courseId}/chapters/${chapterId}/topic`,
      topics
    );
  }

  const saveMutation = useMutation({
    mutationFn: saveTopics,
    onSuccess: () => {
      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <div className="max-w-xl">
      {/* <Button onClick={getAILessons}>Generate</Button> */}
      <div className="">
        {topics?.map((topic, index) => (
          <TopicCard params={params} key={index} topic={topic} />
        ))}
      </div>
      <div className="flex justify-between py-2">
        <LoadingButton
          onClick={() => aiMutation.mutate()}
          content={topics ? "Regenerate" : "Generate"}
          loading={aiMutation.isPending}
          loadingContent={topics ? "Regenerating" : "Generating"}
        />
        {topics && (
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

function LoadingButton({
  loading,
  content,
  loadingContent,
  onClick,
}: {
  loading: boolean;
  content: string;
  loadingContent: string;
  onClick: () => void;
}) {
  return (
    <Button onClick={onClick}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {loadingContent}
        </>
      ) : (
        content
      )}
    </Button>
  );
}
