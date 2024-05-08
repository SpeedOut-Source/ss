import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getAIText } from "@/actions/get-ai-text";

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { prompt } = await req.json();
    
    const aiTitle = await getAIText(prompt);
    
    if (!aiTitle) {
      return new NextResponse("AI Error", { status: 500 });
    }

    console.log("[aiTitle]", aiTitle);
    console.log("[prompt]", prompt);
    console.log("[courseId]", params.courseId);

    const course = await db.course.update({
      where: {
        id: params.courseId,
        userId
      },
      data: {
          title: aiTitle
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[userSettings]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
