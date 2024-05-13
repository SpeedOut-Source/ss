import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { getAILessonTextContent } from "@/actions/get-ai-lesson-content";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { getAILessons } from "@/actions/get-ai-lessons";

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { messages } = (await req.json()) as {
      messages: ChatCompletionMessageParam[];
    };

    const lesson = await getAILessons({ messages });

    if (lesson) {
      const les = lesson;
      if ("content" in lesson) {
        const content = lesson;

        return NextResponse.json(content);
        // Your code here
      } else {
        const content = lesson;
        return NextResponse.json(content);
      }
    }
    return new NextResponse("Lesson not found", { status: 404 });
  } catch (error) {
    console.log("[userSettings]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
