import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { LessonType } from "@prisma/client";
import { z } from "zod";
import { topicTypeSchema } from "@/lib/type";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    console.log(params, "dfdlkjldkf");

    return;

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json("lessons");
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  // Rest of the code...

  try {
    const formData = await req.json();

    const topicsSchema = z.array(topicTypeSchema);
    const data = topicsSchema.safeParse(formData);
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (data.success) {
      const ownCourse = await db.course.findUnique({
        where: {
          id: params.courseId,
          userId,
        },
      });

      if (!ownCourse) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const topics = data.data;

      await db.topic.createMany({
        data: topics.map((topic, i) => ({
          ...topic,
          chapterId: params.chapterId,
          Order: i,
        })),
      });
      return NextResponse.json("topics");
    }

    return new NextResponse("Input error", { status: 400 });
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
