import { IconBadge } from "@/components/icon-badge";
import React from "react";
import AddLesson from "../_components/add-lesson";
import Lessons from "../../../_components/lessons";
import { LayoutDashboard } from "lucide-react";
import GenerateTopic from "./_components/generate-topic";
import { db } from "@/lib/db";
import TopicCard from "./_components/topic-card";

export default async function page({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const topics = await db.topic.findMany({
    where: { chapterId: params.chapterId },
  });

  return (
    <div className="p-4">
      <div className="">
        <div>
          {topics.map((topic) => (
            <TopicCard
              topicId={topic.id}
              topic={topic}
              key={topic.id}
              params={params}
            />
          ))}
        </div>
        {/* <div className="flex items-center gap-x-2">
          <IconBadge icon={LayoutDashboard} />
          <h2 className="text-xl">Add your chapter contents</h2>
        </div>
        <Lessons courseId={params.courseId} chapterId={params.chapterId} />
        <AddLesson chapterId={params.chapterId} courseId={params.courseId} /> */}
      </div>
    </div>
  );
}
