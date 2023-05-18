import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";

const Triangle: NextPage = () => {
  const { mutate, data, isLoading } = api.triangle.maxValuePath.useMutation();
  const [triangle, setTriangle] = useState<string>("");

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
            Triangle Max Value Path Calculation
          </h1>

          <form>
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-pink-400">
                Enter the triangle
              </h2>

              {/* text area to write the number triangle */}

              <textarea
                className="w-96 rounded-md bg-white/10 px-5 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                value={triangle}
                onChange={(e) => setTriangle(e.target.value)}
              />
              {/* button to calculate the max value path */}
              <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={(e) => {
                  e.preventDefault();
                  mutate(triangle);
                }}
              >
                Calculate
              </button>
            </div>
          </form>

          {/* display the max value path */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-pink-400">Max Value Path</h2>
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

export default Triangle;
