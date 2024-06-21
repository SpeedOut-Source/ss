import { db } from "@/lib/db";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  getTodos: publicProcedure.query(async () => {
    return "vongcong";
  }),
});

export type AppRouter = typeof appRouter;
