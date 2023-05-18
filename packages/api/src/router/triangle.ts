import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const triangleRouter = createTRPCRouter({
  maxValuePath: publicProcedure
    .input(z.string().min(1))
    .mutation(({ input }) => {
      if (input.trim().length === 1) return input;

      const triangle = input
        .split("\n")
        .map((row) => row.trim().split(" ").map(Number));

      if (!triangle[0] || !triangle) return 0;
      if (!triangle[0][0]) return 0;

      const numbers = [triangle[0][0]];
      let sum = triangle[0][0] ?? 0;
      let col = 0;

      for (let i = 1; i < triangle.length; i++) {
        const row = triangle[i] ?? [];
        const left = row[col] ?? 0;
        const right = row[col + 1] ?? 0;

        if (left > right) {
          numbers.push(left);
          sum += left;
        } else {
          numbers.push(right);
          sum += right;
          col++;
        }
      }
      return sum;
    }),
});
