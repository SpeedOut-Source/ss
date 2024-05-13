"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NextButton({
  params,
}: {
  params: {
    courseId: string;
    chapterId: string;
  };
}) {
  const router = useRouter();
  const onClick = () => {
    toast.success("clicked");
    router.push(
      `/teacher/courses/${params.courseId}/chapters/${params.chapterId}/content`
    );
  };

  return <Button onClick={onClick}>Next</Button>;
}
