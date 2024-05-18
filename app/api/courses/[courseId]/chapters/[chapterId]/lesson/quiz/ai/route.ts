import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getAIText } from "@/actions/ai/get-ai-text";
import { getAIQuiz } from "@/actions/ai/get-ai-quiz";

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

    const aiQuiz = await getAIQuiz(
      "Generate a quiz for the course Javascript and lesson is Javascript Types"
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
