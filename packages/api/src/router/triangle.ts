import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const triangleRouter = createTRPCRouter({
  maxValuePath: publicProcedure
    .input(z.string().min(1))
    .mutation(({ input }) => {
      const triangle = input
        .split("\n")
        .map((row) => row.trim().split(" ").map(Number));

      const numbers = triangle.map((row) =>
        row.map((value) => ({ value, used: false })),
      );

      let sum = 0;
      let col = 0;

      for (let i = 0; i < triangle.length; i++) {
        const row = triangle[i] ?? [];
        const left = row[col] ?? 0;
        const right = row[col + 1] ?? 0;

        if (left > right) {
          sum += left;
          const number = numbers[i]?.[col];
          if (typeof number !== "undefined") {
            number.used = true;
          }
        } else {
          sum += right;
          const number = numbers[i]?.[col + 1];
          if (typeof number !== "undefined") {
            number.used = true;
          }

          col++;
        }
      }

      return { sum, numbers };
    }),
});
