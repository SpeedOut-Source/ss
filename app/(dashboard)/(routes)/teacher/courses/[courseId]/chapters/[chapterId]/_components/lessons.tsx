import { db } from "@/lib/db";
import CourseContents from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/course-contents";
import { TopicType } from "@/lib/type";
import GenerateContent from "../content/_components/generate-content";

export async function Lessons({
  params,
  topic,
  topicId,
}: {
  params: { courseId: string; chapterId: string };
  topicId: string;
  topic: TopicType;
}) {
  const lessons = await db.lesson.findMany({
    where: { topicId: topicId },
    include: { quiz: true },
  });
  if (lessons.length > 0)
    return <CourseContents params={params} lessons={lessons} />;
  else
    return <GenerateContent topicId={topicId} params={params} topic={topic} />;
}
