"use client";

import { Button } from "@/components/ui/button";
import { TopicType } from "@/lib/type";
import { Chapter } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { trpc } from "@/app/_trpc/client";
import { useSession } from "@clerk/nextjs";
import TopicCard from "./topic-card";
import toast from "react-hot-toast";

export default function GenerateTopic({
  params,
  chapter,
}: {
  params: { courseId: string; chapterId: string };
  chapter: Chapter;
}) {
  const { courseId, chapterId } = params;
  const user = useSession();

  const chapterName = chapter.title;
  const chapterDescription = chapter.description;

  const [topics, setTopics] = useState<TopicType[]>();

  const topicsM = trpc.generateTopics.useMutation({
    onSuccess: (data, Variable) => {
      setTopics(data);
    },
  });

  const saveTopicM = trpc.saveTopics.useMutation({
    onSuccess: () => toast.success("saved"),
    onError: (e) => toast.error(`${e.message}`),
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
          onClick={() => topicsM.mutate({ chapterDescription, chapterName })}
          content={topics ? "Regenerate" : "Generate"}
          loading={topicsM.isPending}
          loadingContent={topics ? "Regenerating" : "Generating"}
        />
        {topics && (
          <LoadingButton
            onClick={() =>
              saveTopicM.mutate({
                chapterId,
                courseId,
                topics,
                userId: user.session?.id ?? "1",
              })
            }
            content={"Save"}
            loading={saveTopicM.isPending}
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
