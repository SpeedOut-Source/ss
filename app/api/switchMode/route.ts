import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const params = await req.json();

    const data = {
      userId,
      ...params,
    };

    const userSettings = await db.userSettings.upsert({
      where: { userId },
      create: data,
      update: data,
  });

    return NextResponse.json(userSettings);
  } catch (error) {
    console.log("[userSettings]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
