import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TopicType } from "@/lib/type";
import GenerateContent from "./generate-content";
import { db } from "@/lib/db";
import CourseContents from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/course-contents";

export default async function TopicCard({
  topicId,

  params,
  topic,
}: {
  topicId?: string;
  topic: TopicType;
  params: { courseId: string; chapterId: string };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{topic.title}</CardTitle>
        <CardDescription>{topic.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{topic.prompt}</p>
        {topicId && <Lessons params={params} topic={topic} topicId={topicId} />}
      </CardContent>
    </Card>
  );
}

async function Lessons({
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
    include: { quize: true },
  });
  if (lessons.length > 0)
    return <CourseContents params={params} lessons={lessons} />;
  else
    return <GenerateContent topicId={topicId} params={params} topic={topic} />;
}
