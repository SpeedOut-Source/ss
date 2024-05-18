import { getCourseDetails } from "@/actions/ai/get-ai-course-details";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

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

    // console.log("[vongCong]", messages);

    const course = await getCourseDetails({ messages });

    if (course) {
      return NextResponse.json(course);
    }
    return new NextResponse("Lesson not found", { status: 404 });
  } catch (error) {
    console.log("[userSettings]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
