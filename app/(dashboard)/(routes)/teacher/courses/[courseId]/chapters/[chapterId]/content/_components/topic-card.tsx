"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TopicType } from "@/lib/type";
import { Lessons } from "../../_components/lessons";

export default function TopicCard({
  topicId,
  show,
  params,
  topic,
}: {
  topicId?: string;
  topic: TopicType;
  params: { courseId: string; chapterId: string };
  show?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{topic.title}</CardTitle>
        <CardDescription>{topic.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{topic.prompt}</p>
        {topicId && (
          <Lessons
            params={params}
            show={show}
            topic={topic}
            topicId={topicId}
          />
        )}
      </CardContent>
    </Card>
  );
}
