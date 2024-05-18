import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getIsTeacher } from "@/actions/get-is-teacher";
import { AICourseDescriptionType, aiCourseDescriptionSchema } from "@/lib/type";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const data = await req.json();

    const d = aiCourseDescriptionSchema.safeParse(data);
    if (d.success) {
      const isTeacher = await getIsTeacher(userId);

      if (!userId || !isTeacher) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const courseData = d.data;

      const course = await db.course.create({
        data: {
          userId,
          title: courseData.courseName,

          description: courseData.description,
          chapters: {
            createMany: {
              data: courseData.chapters.map((chap, i) => ({
                title: chap.title,
                description: chap.description,
                position: i,
              })),
            },
          },
        },
      });

      return NextResponse.json(course);
    }
    return new NextResponse("Invalid data", { status: 400 });
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
