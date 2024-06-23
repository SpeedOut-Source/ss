"use client";
import { trpc } from "@/app/_trpc/client";
import { Chapter } from "@prisma/client";
import GenerateTopic from "../chapters/[chapterId]/content/_components/generate-topic";
import TopicCard from "../chapters/[chapterId]/content/_components/topic-card";

export function Topics({
  params,
  chapter,
}: {
  params: { chapterId: string; courseId: string };
  chapter: Chapter;
}) {
  const topics = trpc.getTopics.useQuery({ chapterId: params.chapterId });

  if (topics.data)
    if (topics.data.length > 0) {
      return (
        <div className="max-w-xl">
          <div>
            {topics.data.map((topic) => (
              <TopicCard
                topicId={topic.id}
                params={params}
                topic={topic}
                key={topic.id}
              />
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <GenerateTopic params={params} chapter={chapter} />
        </div>
      );
    }
}
