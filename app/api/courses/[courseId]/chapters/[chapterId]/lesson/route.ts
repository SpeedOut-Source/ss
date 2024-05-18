import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { LessonType } from "@prisma/client";
import { z } from "zod";

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

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lessons = await db.lesson.findMany({
      where: { topicId: params.chapterId },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  const formData = await req.json();

  const formDataSchema = z.object({
    id: z.string().optional(),
    textContent: z.string(),
  });

  const data = formDataSchema.safeParse(formData);

  // Rest of the code...

  if (data.success)
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

      if (!ownCourse) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      if (data.data.id) {
        // update data
        const lesson = await db.lesson.update({
          where: { id: data.data.id },
          data: { textContent: data.data.textContent },
        });

        return NextResponse.json(lesson);
      } else {
        // create new
        const quizData = data.data;
        const lesson = await db.lesson.create({
          data: {
            order: 1,
            topicId: params.chapterId,
            type: LessonType.TEXT_CONTENT,
            textContent: quizData.textContent,
          },
        });
        return NextResponse.json(lesson);
      }

      return new NextResponse("Internal Error", { status: 500 });
    } catch (error) {
      console.log("[CHAPTER_UNPUBLISH]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  return new NextResponse("Internal Error", { status: 500 });
}
