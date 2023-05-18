import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const lettersRouter = createTRPCRouter({
  getMissingLetters: publicProcedure
    .input(z.string().min(1))
    .mutation(({ input }) => {
      const missing = [];
      const alphabet = "abcdefghijklmnopqrstuvwxyz";
      const sentenceLower = input.toLowerCase();
      for (let i = 0; i < alphabet.length; i++) {
        if (sentenceLower.indexOf(alphabet[i] ?? "a") === -1) {
          missing.push(alphabet[i] ?? "a");
        }
      }
      return missing;
    }),
});
