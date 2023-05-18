import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";

const Letters: NextPage = () => {
  const { mutate, data } = api.letters.getMissingLetters.useMutation();
  const [sentence, setSentence] = useState<string>("");

  return (
    <>
      <Head>
        <title>Tychon Take Home | Triangle</title>
        <meta name="description" content="Tychon Take Home | Triangle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Find missing letters
          </h1>

          <form>
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-pink-400">
                Enter the sentence
              </h2>

              {/* text input to write sentence */}

              <input
                className="w-96 rounded-md bg-white/10 px-5 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
              />
              {/* button to find missing letters */}
              <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={(e) => {
                  e.preventDefault();
                  mutate(sentence);
                }}
              >
                Find
              </button>
            </div>
          </form>

          {/* display missing letters */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-pink-400">
              Missing Letters
            </h2>
            <textarea
              className="w-96 rounded-md bg-white/10 px-5 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              value={data}
              readOnly
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Letters;
