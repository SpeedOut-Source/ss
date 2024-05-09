import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { getAILessonTextContent } from "@/actions/get-ai-lesson-content";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // const { prompt } = await req.json();

    const aiQuiz = await getAILessonTextContent(
      "Generate  text lesson  for the course Javascript and chapter is Javascript Types"
    );

    if (!aiQuiz) {
      return new NextResponse("AI Error", { status: 500 });
    }

    console.log("[aiTitle]", aiQuiz);
    // console.log("[prompt]", prompt);
    console.log("[courseId]", params.courseId);

    return NextResponse.json(aiQuiz);
  } catch (error) {
    console.log("[userSettings]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
