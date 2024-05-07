import { auth } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";

import { db } from "@/lib/db";
import { LessonType } from "@prisma/client";
import { quizFormSchema } from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/interface/quiz";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  const formData = await req.json();
  const data = quizFormSchema.safeParse(formData);
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
        const {
          correctAnswer: correctOption,
          option1,
          option2,
          option3,
          option4,
          question,
        } = data.data;
        // update data
        const quiz = await db.quiz.update({
          where: { id: data.data.id },
          data: {
            correctAnswer: correctOption,
            option1,
            option2,
            option3,
            option4,
            question,
          },
        });
        return NextResponse.json(quiz);
      } else {
        // create new
        const quizData = data.data;
        const lesson = await db.lesson.create({
          data: {
            chapterId: params.chapterId,
            type: LessonType.QUIZ,
            quize: {
              create: {
                correctAnswer: quizData.correctAnswer,
                option1: quizData.option1,
                option2: quizData.option2,
                option3: quizData.option3,
                option4: quizData.option4,
                question: quizData.question,
              },
            },
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
