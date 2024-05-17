import { IconBadge } from "@/components/icon-badge";
import React from "react";
import AddLesson from "../_components/add-lesson";
import Lessons from "../../../_components/lessons";
import { LayoutDashboard } from "lucide-react";
import GenerateTopic from "./_components/generate-topic";

export default function page({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  return (
    <div className="p-4">
      <div className="max-w-xl">
        <div className="flex items-center gap-x-2">
          <IconBadge icon={LayoutDashboard} />
          <h2 className="text-xl">Add your chapter contents</h2>
        </div>
        <Lessons courseId={params.courseId} chapterId={params.chapterId} />
        <AddLesson chapterId={params.chapterId} courseId={params.courseId} />
        <GenerateTopic />
      </div>
    </div>
  );
}
