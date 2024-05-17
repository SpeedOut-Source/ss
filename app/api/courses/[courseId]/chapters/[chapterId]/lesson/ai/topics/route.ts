import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { getAILessons } from "@/actions/get-ai-lessons";
import { getChapterTopics } from "@/actions/get-ai-topics";

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

    const quizes = await getChapterTopics({ messages });

    if (quizes) {
      NextResponse.json(quizes);
    }
    return new NextResponse("Lesson not found", { status: 404 });
  } catch (error) {
    console.log("[userSettings]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
