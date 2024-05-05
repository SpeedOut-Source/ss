import { db } from "@/lib/db";

export const getIsTeacher = async (userId?: string | null) => {
  if (userId == null) return false;

  const userSettings = await db.userSettings.findUnique({
    where: {
      userId,
    },
  });

  return userSettings?.isTeacher || false;
};
