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

const findMaxPath = (
  numbers: {
    value: number;
    row: number;
    col: number;
  }[][],
): Path => {
  const memo: Path[][] = [];

  for (let row = numbers.length - 1; row >= 0; row--) {
    memo[row] = [];
    const rowLen = numbers[row]?.length;
    if (!rowLen) continue;

    for (let col = 0; col < rowLen; col++) {
      const cell = numbers[row]?.[col];
      if (!cell || !memo[row]) continue;

      const nextRow = numbers[row + 1] || [];

      if (nextRow.length === 0) {
        if (!memo[row]) continue;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        memo[row]![col] = { sum: cell.value, cells: [cell] };
      } else {
        const memoRow = memo[row + 1];
        if (!memoRow) continue;

        const leftPath = memoRow[col];
        const rightPath = memoRow[col + 1];

        if (!leftPath || !rightPath) continue;

        if (leftPath.sum > rightPath.sum) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          memo[row]![col] = {
            sum: cell.value + leftPath.sum,
            cells: [cell, ...leftPath.cells],
          };
        } else {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          memo[row]![col] = {
            sum: cell.value + rightPath.sum,
            cells: [cell, ...rightPath.cells],
          };
        }
      }
    }
  }

  return memo[0]?.[0] || { sum: 0, cells: [] };
};

const findMinPath = (
  row: number,
  col: number,
  numbers: {
    value: number;
    row: number;
    col: number;
  }[][],
): Path => {
  const cell = numbers[row]?.[col];
  const nextRow = numbers[row + 1] || [];

  if (!cell) {
    return { sum: 0, cells: [] };
  }

  if (nextRow.length === 0) {
    return { sum: cell.value, cells: [cell] };
  }

  const leftPath = findMinPath(row + 1, col, numbers);
  const rightPath = findMinPath(row + 1, col + 1, numbers);

  if (leftPath.sum < rightPath.sum) {
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

      const maxPath = findMaxPath(numbers);

      return { sum: maxPath.sum, usedCells: maxPath.cells };
    }),

  minValuePath: publicProcedure
    .input(z.string().min(1))
    .mutation(({ input: triangle }) => {
      const numbers = triangle.split("\n").map((row, i) =>
        row
          .trim()
          .split(/\s+/)
          .map((cell, col) => ({
            value: +cell.replace(/\D/g, ""),
            row: i,
            col,
          })),
      );

      console.log("\n\n\n", "a", "\n\n\n");
      const minPath = findMinPath(0, 0, numbers);

      return { sum: minPath.sum, usedCells: minPath.cells };
    }),
});
