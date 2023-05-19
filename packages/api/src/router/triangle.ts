import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

type Cell = {
  value: number;
  row: number;
  col: number;
};

type Path = {
  sum: number;
  cells: Cell[];
};

export const triangleRouter = createTRPCRouter({
  maxValuePath: publicProcedure
    .input(z.string().min(1))
    .mutation(({ input: triangle }) => {
      const numbers = triangle
        .split("\n")
        .map((row, i) =>
          row
            .trim()
            .split(/\s+/)
            .map((cell, col) => ({
              value: +cell.replace(/\D/g, ""),
              row: i,
              col,
            })),
        )
        .slice(0, -1);

      const findMaxPath = (row: number, col: number): Path => {
        const cell = numbers[row]?.[col];
        const nextRow = numbers[row + 1] || [];

        if (!cell) {
          return { sum: 0, cells: [] };
        }

        if (nextRow.length === 0) {
          return { sum: cell.value, cells: [cell] };
        }

        const leftPath = findMaxPath(row + 1, col);
        const rightPath = findMaxPath(row + 1, col + 1);

        if (leftPath.sum > rightPath.sum) {
          return {
            sum: cell.value + leftPath.sum,
            cells: [cell, ...leftPath.cells],
          };
        } else {
          return {
            sum: cell.value + rightPath.sum,
            cells: [cell, ...rightPath.cells],
          };
        }
      };

      const maxPath = findMaxPath(0, 0);

      return { sum: maxPath.sum, usedCells: maxPath.cells };
    }),
});
