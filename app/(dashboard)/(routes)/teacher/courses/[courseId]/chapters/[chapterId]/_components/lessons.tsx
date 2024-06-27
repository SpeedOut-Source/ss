"use client";
import CourseContents from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/course-contents";
import { trpc } from "@/app/_trpc/client";
import { TopicType } from "@/lib/type";
import GenerateContent from "../content/_components/generate-content";

export function Lessons({
  params,
  topic,
  topicId,
}: {
  params: { courseId: string; chapterId: string };
  topicId: string;
  topic: TopicType;
}) {
  const lessonsQ = trpc.getLessons.useQuery({ topicId });
  if (lessonsQ.isLoading) return <div>Loading...</div>;
  if (lessonsQ.error) return <div>Error: {lessonsQ.error.message}</div>;

  const lessons = lessonsQ.data;
  if (lessons)
    if (lessons.length > 0)
      return <CourseContents params={params} lessons={lessons} />;
    else
      return (
        <GenerateContent topicId={topicId} params={params} topic={topic} />
      );
}
