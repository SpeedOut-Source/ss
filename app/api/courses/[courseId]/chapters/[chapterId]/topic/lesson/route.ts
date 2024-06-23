import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { LessonType } from "@prisma/client";
import { z } from "zod";
import { quizTypeSchema, topicTypeSchema } from "@/lib/type";
import { quizFormSchema } from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/interface/quiz";

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

    const contentSchema = z.object({
      content: z.string(),
      quizes: z.array(quizTypeSchema),
      topicId: z.string(),
    });
    const data = contentSchema.safeParse(formData);
    const { userId } = auth();

    console.log(data.error?.message, "data");

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

      const contents = data.data;
      const textContent = contents.content;
      const quizzes = contents.quizes;
      const topicId = contents.topicId;

      await db.lesson.create({
        data: {
          order: 1,
          textContent: textContent,
          topicId,
          type: LessonType.TEXT_CONTENT,
        },
      });

      await db.lesson.createMany({
        data: quizzes.map((quiz, i) => ({
          order: i + 2,
          topicId,
          type: LessonType.QUIZ,
          quize: { create: { ...quiz } },
        })),
      });

      return NextResponse.json("lessons");
    }

    return new NextResponse("Input error", { status: 400 });
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
