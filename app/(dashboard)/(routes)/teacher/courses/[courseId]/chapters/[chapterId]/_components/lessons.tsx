"use client";
import CourseContents from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/course-contents";
import { trpc } from "@/app/_trpc/client";
import { TopicType } from "@/lib/type";
import GenerateContent from "../content/_components/generate-content";

export function Lessons({
  params,
  topic,
  topicId,
  show,
}: {
  params: { courseId: string; chapterId: string };
  topicId: string;
  topic: TopicType;
  show?: boolean;
}) {
  const lessonsQ = trpc.getLessons.useQuery({ topicId });
  if (lessonsQ.isLoading) return <div>Loading...</div>;
  if (lessonsQ.error) return <div>Error: {lessonsQ.error.message}</div>;

  const lessons = lessonsQ.data;
  if (lessons)
    if (lessons.length > 0)
      return <CourseContents params={params} lessons={lessons} />;
    else if (lessons.length === 0 && !show)
      return (
        <GenerateContent topicId={topicId} params={params} topic={topic} />
      );
}
