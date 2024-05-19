import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { getTextContentAI } from "@/actions/ai/text-content";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { getQuizContentAI } from "@/actions/ai/quizes-content";

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

    const content = await getTextContentAI({ messages });

    if (content) {
      return NextResponse.json(content);
    }
    return new NextResponse("Lesson not found", { status: 404 });
  } catch (error) {
    console.log("[userSettings]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
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

    const quizzes = await getQuizContentAI({ messages });

    if (quizzes) {
      return NextResponse.json(quizzes);
    }
    return new NextResponse("Lesson not found", { status: 404 });
  } catch (error) {
    console.log("[userSettings]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
