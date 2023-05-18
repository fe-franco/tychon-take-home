import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { triangleRouter } from "./router/triangle";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  triangle: triangleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
